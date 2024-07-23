"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TO_PROTOCOL = void 0;
const dswap_router_sdk_1 = require("@miljan9602/dswap-router-sdk");
const TO_PROTOCOL = (protocol) => {
    switch (protocol.toLowerCase()) {
        case 'v3':
            return dswap_router_sdk_1.Protocol.V3;
        case 'v2':
            return dswap_router_sdk_1.Protocol.V2;
        case 'mixed':
            return dswap_router_sdk_1.Protocol.MIXED;
        default:
            throw new Error(`Unknown protocol: {id}`);
    }
};
exports.TO_PROTOCOL = TO_PROTOCOL;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9jb2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwvcHJvdG9jb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1FQUF3RDtBQUVqRCxNQUFNLFdBQVcsR0FBRyxDQUFDLFFBQWdCLEVBQVksRUFBRTtJQUN4RCxRQUFRLFFBQVEsQ0FBQyxXQUFXLEVBQUUsRUFBRTtRQUM5QixLQUFLLElBQUk7WUFDUCxPQUFPLDJCQUFRLENBQUMsRUFBRSxDQUFDO1FBQ3JCLEtBQUssSUFBSTtZQUNQLE9BQU8sMkJBQVEsQ0FBQyxFQUFFLENBQUM7UUFDckIsS0FBSyxPQUFPO1lBQ1YsT0FBTywyQkFBUSxDQUFDLEtBQUssQ0FBQztRQUN4QjtZQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUM3QztBQUNILENBQUMsQ0FBQztBQVhXLFFBQUEsV0FBVyxlQVd0QiJ9