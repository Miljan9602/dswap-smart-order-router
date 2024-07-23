import { GasDataArbitrum__factory } from '../../types/other/factories/GasDataArbitrum__factory';
import { ARB_GASINFO_ADDRESS } from '../../util';
export class ArbitrumGasDataProvider {
    constructor(chainId, provider, gasDataAddress) {
        this.chainId = chainId;
        this.provider = provider;
        this.gasFeesAddress = gasDataAddress ? gasDataAddress : ARB_GASINFO_ADDRESS;
    }
    async getGasData(providerConfig) {
        const gasDataContract = GasDataArbitrum__factory.connect(this.gasFeesAddress, this.provider);
        const gasData = await gasDataContract.getPricesInWei({
            blockTag: providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber,
        });
        const perL1CalldataByte = gasData[1];
        return {
            perL2TxFee: gasData[0],
            perL1CalldataFee: perL1CalldataByte.div(16),
            perArbGasTotal: gasData[5],
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FzLWRhdGEtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3YzL2dhcy1kYXRhLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE9BQU8sRUFDTCx3QkFBd0IsRUFDekIsTUFBTSxzREFBc0QsQ0FBQztBQUM5RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxZQUFZLENBQUM7QUE0QmpELE1BQU0sT0FBTyx1QkFBdUI7SUFNbEMsWUFDWSxPQUFnQixFQUNoQixRQUFzQixFQUNoQyxjQUF1QjtRQUZiLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsYUFBUSxHQUFSLFFBQVEsQ0FBYztRQUdoQyxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQztJQUM5RSxDQUFDO0lBRU0sS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUErQjtRQUNyRCxNQUFNLGVBQWUsR0FBRyx3QkFBd0IsQ0FBQyxPQUFPLENBQ3RELElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FBQyxRQUFRLENBQ2QsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUFHLE1BQU0sZUFBZSxDQUFDLGNBQWMsQ0FBQztZQUNuRCxRQUFRLEVBQUUsY0FBYyxhQUFkLGNBQWMsdUJBQWQsY0FBYyxDQUFFLFdBQVc7U0FDdEMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsT0FBTztZQUNMLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLGdCQUFnQixFQUFFLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDM0MsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDM0IsQ0FBQztJQUNKLENBQUM7Q0FDRiJ9