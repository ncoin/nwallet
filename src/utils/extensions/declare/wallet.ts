import {  updateProtocolStatic } from '../implement/wallet';

declare module '../../../models/nwallet/wallet' {
    interface Item {
        // initData: typeof initProtocolStatic;
        updateData: typeof updateProtocolStatic;
    }
}
