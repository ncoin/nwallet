import { PutProtocolBase, NoResponse, NoConvert } from './http/http-protocol';
import { Paths } from './http/paths';

export class PutConfiguration extends PutProtocolBase<{ device_id: string; is_push_notification: boolean }, NoResponse, NoConvert> {
    public url = () => Paths.put.configuraton(this.credential.userId);
}
