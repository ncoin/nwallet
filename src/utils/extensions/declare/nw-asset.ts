import { getNameStatic } from '../implement/nw-asset';

declare module '../../../models/nwallet/asset' {
    interface Item {
        getName: typeof getNameStatic;
    }
}
