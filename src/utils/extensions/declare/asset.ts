import {  updateProtocolStatic } from '../implement/asset';

declare module '../../../models/nwallet/asset' {
    interface Item {
        // initData: typeof initProtocolStatic;
        updateData: typeof updateProtocolStatic;
    }
}
