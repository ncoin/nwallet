import { toProtocolStatic, updateProtocolStatic } from '../implement/asset';

declare module '../../../models/nwallet/asset' {
    interface Item {
        toProtocol: typeof toProtocolStatic;
        updateProtocol: typeof updateProtocolStatic;
    }
}
