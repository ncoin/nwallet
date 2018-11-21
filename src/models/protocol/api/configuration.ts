import { NoResponseData,  MethodTypes, NoQuery } from '../../http/http-protocol';
import { NClientProtocolBase } from './http-protocol';
import { Paths } from './paths';

export class SetConfigurations extends NClientProtocolBase<NoQuery, { device_id: string; is_push_notification: boolean }, NoResponseData> {
    public method = MethodTypes.PUT;
    public url = () => Paths.put.configuraton(this.credential.userId);
}
