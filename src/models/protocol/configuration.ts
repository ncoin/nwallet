import { PutProtocolBase, NoResponseData, NoConvert } from './http/http-protocol';
import { Paths } from './http/paths';

export class PutConfiguration extends PutProtocolBase<{ device_id: string; is_push_notification: boolean }, NoResponseData, NoConvert> {
    public url = () => Paths.put.configuraton(this.credential.userId);
}
