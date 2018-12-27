import { NWalletProtocolBase } from './_impl';
import { NoQuery, MethodTypes, NoPayload } from '../../http/protocol';
import { NWResponse, NWData } from '../../nwallet';
import { WalletApiPaths } from './paths';

export class RegisterNotification extends NWalletProtocolBase<
    NoQuery,
    { userId: number; deviceId: string; /** firebase device token */ firebaseDeviceToken: string },
    NWResponse.Notification
> {
    public method = MethodTypes.POST;
    public data: NWData.Notification;
    protected errorMessages = {
        400: 'InvalidFormat|InvalidArgument'
    };

    public url = () => WalletApiPaths.post.registerPush(this.credential.userId);

    public manufacture() {
        this.data = Object.assign(new NWData.Notification(), this.response);
    }
}

export class ChangeNotification extends NWalletProtocolBase<NoQuery, { userId: number; deviceId: string; isPush: boolean }, NWResponse.Notification> {
    public method = MethodTypes.PUT;
    public data: NWData.Notification;
    protected errorMessages = {
        400: 'InvalidFormat|InvalidArgument'
    };

    public url = () => WalletApiPaths.put.changePush(this.credential.userId);

    public manufacture() {
        this.data = Object.assign(new NWData.Notification(), this.response);
    }
}

export class CheckNotification extends NWalletProtocolBase<{ deviceId: string }, NoPayload, NWResponse.Notification> {
    public method = MethodTypes.GET;
    public data: NWData.Notification;
    protected errorMessages = {
        400: 'InvalidFormat|InvalidArgument'
    };

    public url = () => WalletApiPaths.get.checkPush(this.credential.userId);

    public manufacture() {
        this.data = Object.assign(new NWData.Notification(), this.response);
    }
}
