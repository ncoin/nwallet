import { PutProtocolBase, NoResponse, NoConvert, Paths } from './http/http-protocol';

export class SetConfigurationProtocol extends PutProtocolBase<
    {
        device_id: string;
        is_push_notification: boolean;
    },
    NoResponse,
    NoConvert
> {
    public url = () => Paths.put.configuraton(this.credential.userId);
}
