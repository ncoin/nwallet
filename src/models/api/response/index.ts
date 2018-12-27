import { ResultCode } from '../../../interfaces/error';
import { NWalletProtocolBase } from '../nwallet/_impl';

export * from './ticker.response';
export * from './wallet.response';
export * from './transaction.response';
export * from './wallet.response';
export * from './currency.response';
export * from './token.response';
export * from './notification.response';

export class Result<T = any> {
    code: ResultCode;
    reason: string;
    public data: T;
    constructor() {}

    static resolve<T>(data?: T) {
        return (p: NWalletProtocolBase): Result<T> => {
            const context = new Result<T>();
            if (p.isSuccess()) {
                context.code = ResultCode.Success;
                context.data = data;
            } else {
                context.code = ResultCode.ApiFailed;
                context.reason = p.getErrorMessage();
            }

            return context;
        };
    }
}
