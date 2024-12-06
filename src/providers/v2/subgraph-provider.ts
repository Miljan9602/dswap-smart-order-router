import { ChainId, Token } from '@miljan9602/dswap-sdk-core';
import retry from 'async-retry';
import Timeout from 'await-timeout';

import { log } from '../../util/log';
import { metric } from '../../util/metric';
import { ProviderConfig } from '../provider';

export const BLACKLISTED_V2_TOKENS = [
  '0xad0c5b8c5508ae8fa0195d5d633ad34ebc232437',
  '0x6c155dc99e0a75302e23447e2ebaa4c5fa21dfcc',
  '0x66491aa9e4a02f1da8e3e842bb47585e18957db3',
  '0xc452f2f135a72b322bd453aa28d40adcb4bc9c41',
  '0x1fa26eb21d8fd66ba8fe845d6e813135f893ba63',
  '0x6c155dc99e0a75302e23447e2ebaa4c5fa21dfcc',
  '0x9d9ee08d969557a35208d1c5cf0728c0a65aaff5',
  '0xad0c5b8c5508ae8fa0195d5d633ad34ebc232437',
  '0x79286845fbe1f47d2c9115e7918007290c548439'
];

export interface V2SubgraphPool {
  id: string;
  token0: {
    id: string;
  };
  token1: {
    id: string;
  };
  supply: number;
  reserve: number;
  reserveUSD: number;
}

type RawV2SubgraphPool = {
  id: string;
  token0: {
    symbol: string;
    id: string;
  };
  token1: {
    symbol: string;
    id: string;
  };
  totalSupply: string;
  trackedReserveETH: string;
  reserveUSD: string;
};

const SUBGRAPH_URL_BY_CHAIN: { [chainId in ChainId]?: string } = {
  [ChainId.SEI_MAINNET]: 'https://sei-api.dragonswap.app/api/v1/graph/factory/pairs',
};

const PAGE_SIZE = 1000; // 1k is max possible query size from subgraph.

/**
 * Provider for getting V2 pools from the Subgraph
 *
 * @export
 * @interface IV2SubgraphProvider
 */
export interface IV2SubgraphProvider {
  getPools(
    tokenIn?: Token,
    tokenOut?: Token,
    providerConfig?: ProviderConfig
  ): Promise<V2SubgraphPool[]>;
}

export class V2SubgraphProvider implements IV2SubgraphProvider {
  // private client: GraphQLClient;
  private subgraphUrl: string;


  constructor(
    private chainId: ChainId,
    private retries = 2,
    private timeout = 360000,
    private rollback = true,
    private pageSize = PAGE_SIZE,
    private trackedEthThreshold = 30,
    private untrackedUsdThreshold = Number.MAX_VALUE,
    private subgraphUrlOverride?: string
  ) {
    const subgraphUrl = this.subgraphUrlOverride ?? SUBGRAPH_URL_BY_CHAIN[this.chainId];
    if (!subgraphUrl) {
      throw new Error(`No subgraph url for chain id: ${this.chainId}`);
    }
    this.subgraphUrl = subgraphUrl;
  }

  public async getPools(
    _tokenIn?: Token,
    _tokenOut?: Token,
    providerConfig?: ProviderConfig
  ): Promise<V2SubgraphPool[]> {

    const beforeAll = Date.now();
    let blockNumber = providerConfig?.blockNumber
      ? await providerConfig.blockNumber
      : undefined;
    // Due to limitations with the Subgraph API this is the only way to parameterize the query.


    let pools: RawV2SubgraphPool[] = [];

    log.info(
      `Getting V2 pools from the subgraph with page size ${this.pageSize}${
        providerConfig?.blockNumber
          ? ` as of block ${providerConfig?.blockNumber}`
          : ''
      }.`
    );

    await retry(
      async () => {
        const timeout = new Timeout();

        const getPools = async (): Promise<RawV2SubgraphPool[]> => {

          let pairs: RawV2SubgraphPool[] = [];
          let pairsPage: RawV2SubgraphPool[] = [];
          let hasMore = true;
          let page = 1;

          do {

            const url = this.subgraphUrl.concat("?page=" + page)
            const poolsResult = await (await fetch(url)).json()

            pairsPage = poolsResult.data.pairs;
            pairs = pairs.concat(pairsPage);

            page++;
            hasMore = pairsPage = poolsResult.data.has_more;

          }while (hasMore);

          return pairs
        };

        /* eslint-disable no-useless-catch */
        try {
          const getPoolsPromise = getPools();
          const timerPromise = timeout.set(this.timeout).then(() => {
            throw new Error(
              `Timed out getting pools from subgraph: ${this.timeout}`
            );
          });
          pools = await Promise.race([getPoolsPromise, timerPromise]);
          return;
        } catch (err) {
          throw err;
        } finally {
          timeout.clear();
        }
        /* eslint-enable no-useless-catch */
      },
      {
        retries: this.retries,
        onRetry: (err, retry) => {
          if (
            this.rollback &&
            blockNumber
          ) {
            blockNumber = blockNumber - 10;
            log.info(
              `Detected subgraph indexing error. Rolled back block number to: ${blockNumber}`
            );
          }
          pools = [];
          log.info(
            { err },
            `Failed to get pools from subgraph. Retry attempt: ${retry}`
          );
        },
      }
    );


    // Filter pools that have tracked reserve ETH less than threshold.
    // trackedReserveETH filters pools that do not involve a pool from this allowlist:
    // https://github.com/Uniswap/v2-subgraph/blob/7c82235cad7aee4cfce8ea82f0030af3d224833e/src/mappings/pricing.ts#L43
    // Which helps filter pools with manipulated prices/liquidity.

    // TODO: Remove. Temporary fix to ensure tokens without trackedReserveETH are in the list.

    const tracked = pools.filter(pool => {

      if (BLACKLISTED_V2_TOKENS.includes(pool.token0.id) || BLACKLISTED_V2_TOKENS.includes(pool.token1.id)) return false

      return parseFloat(pool.trackedReserveETH) > this.trackedEthThreshold
      }
    );

    metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.filter.length`, tracked.length);
    metric.putMetric(
      `V2SubgraphProvider.chain_${this.chainId}.getPools.filter.percent`,
      (tracked.length / pools.length) * 100
    );

    const beforeFilter = Date.now();
    const poolsSanitized: V2SubgraphPool[] = pools
      .filter((pool) => {

        if (BLACKLISTED_V2_TOKENS.includes(pool.token0.id) || BLACKLISTED_V2_TOKENS.includes(pool.token1.id)) return false

        return (
          parseFloat(pool.trackedReserveETH) > this.trackedEthThreshold ||
          parseFloat(pool.reserveUSD) > this.untrackedUsdThreshold
        );
      })
      .map((pool) => {
        return {
          id: pool.id.toLowerCase(),
          token0: {
            id: pool.token0.id.toLowerCase(),
          },
          token1: {
            id: pool.token1.id.toLowerCase(),
          },
          supply: parseFloat(pool.totalSupply),
          reserve: parseFloat(pool.trackedReserveETH),
          reserveUSD: parseFloat(pool.reserveUSD),
        };
      });

    metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.filter.latency`, Date.now() - beforeFilter);
    metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.untracked.length`, poolsSanitized.length);
    metric.putMetric(
      `V2SubgraphProvider.chain_${this.chainId}.getPools.untracked.percent`,
      (poolsSanitized.length / pools.length) * 100
    );
    metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools`, 1);
    metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.latency`, Date.now() - beforeAll);

    log.info(
      `Got ${pools.length} V2 pools from the subgraph. ${poolsSanitized.length} after filtering`
    );

    return poolsSanitized;
  }
}
