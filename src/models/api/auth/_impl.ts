import { HttpProtocol, NoQuery, NoPayload, NoResponseData, NoConvert } from '../../http/protocol';
import { ParameterExpr, createExpr } from 'forge';

export abstract class AuthProtocolBase<TQuery = NoQuery, TPayload = NoPayload, TResponse = NoResponseData, TConvert = NoConvert> extends HttpProtocol {
    public payload: TPayload;
    public response: TResponse;
    public convert: () => TConvert;
    constructor(data?: { query?: TQuery; payload?: TPayload }) {
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
}
