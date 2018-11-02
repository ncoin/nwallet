import { Paths } from './paths';
import { PostProtocolBase, NoConvert, NoQuery, NoPayload } from '../http/http-protocol';
import { Token as _Token } from '../../token';

export class VerifyPhone extends PostProtocolBase<NoPayload, _Token, NoConvert> {
    constructor() {
        super({ userId: 'unknown' });

    }
    public url = () => Paths.token();
}
