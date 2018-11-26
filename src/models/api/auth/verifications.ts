import { Paths } from './paths';
import { NoConvert, NoQuery, NoPayload, NoResponseData, MethodTypes } from '../../http/protocol';
import { AuthProtocolBase } from './_impl';

export class VerifyPhone extends AuthProtocolBase<
    NoQuery,
    {
        countryCode: string;
        number: string;
    }
> {
    method = MethodTypes.POST;
    public url = () => Paths.auth.phone();
}

export class VerifyPhoneComplete extends AuthProtocolBase<
    NoQuery,
    {
        countryCode: string;
        number: string;
        verifyCode?: string;
    }
> {
    method = MethodTypes.POST;
    public url = () => Paths.auth.verifyPhone();
}
