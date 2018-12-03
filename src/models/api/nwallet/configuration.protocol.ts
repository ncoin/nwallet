import { NoResponseData,  MethodTypes, NoQuery } from '../../http/protocol';
import { NWalletProtocolBase } from './_impl';
import { WalletApiPaths } from './paths';

export class SetConfigurations extends NWalletProtocolBase<NoQuery, { device_id: string; is_push_notification: boolean }, NoResponseData> {
    public method = MethodTypes.PUT;
    public url = () => WalletApiPaths.put.configuraton(this.credential.userId);
}
