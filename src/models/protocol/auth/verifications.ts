import { Paths } from './paths';
import { NoConvert, NoQuery, NoPayload, NoResponseData, AuthProtocolBase, MethodTypes } from '../http/http-protocol';

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
