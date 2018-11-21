import { NoQuery, NoPayload, NoResponseData, HttpProtocol } from '../../http/http-protocol';
import { ParameterExpr, createExpr } from 'forge';

export abstract class NClientProtocolBase<TQuery = NoQuery, TPayload = NoPayload, TResponse = NoResponseData> extends HttpProtocol {
    public payload: TPayload;
    public response: TResponse;
    public error: any;

    constructor(protected credential: { userId: string; userWalletId?: number }, data?: { query?: TQuery; payload?: TPayload }) {
        super();

        if (data) {
            if (data.query) {
                this.setQuery(data.query);
            }
            if (data.payload) {
                this.setPayload(data.payload);
            }
        }
    }

    public setQuery(expr: ParameterExpr<TQuery>): this {
        this.query = <any>createExpr(expr);
        return this;
    }

    public setPayload(expr: ParameterExpr<TPayload>): this {
        this.payload = createExpr(expr);
        return this;
    }

    public setResponse(response: TResponse): this {
        super.setResponse(response);
        this.manufacture();
        return this;
    }

    public manufacture() {

    }
}
