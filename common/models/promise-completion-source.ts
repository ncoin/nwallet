import { ParameterExpr, createExpr } from './create-expression';

export class PromiseCompletionSource<T> {
    private resolver: (value?: T | PromiseLike<T>) => void;
    private _promise: Promise<T>;
    private value: T = undefined;

    /**
     * @param timeout mill
     */
    public constructor(private option?: { id: string; timeout?: number }) {
        this._promise = new Promise<T>(resolve => {
            this.resolver = resolve;
        });

        if (option && option.timeout !== undefined) {
            setTimeout(() => {
                if (this.value === undefined) {
                    throw new Error(`promise wait timeout, id : [${this.option.id}]`);
                }
            }, option.timeout);
        }
    }

    public setResult(param: ParameterExpr<T>): void {
        const currentValue = createExpr(param);
        if (this.value !== undefined) {
            const id = this.option === undefined ? '' : `, id = [${this.option.id}]`;
            throw new Error(`promise value already assigned! previous : ${JSON.stringify(this.value)}, current : ${JSON.stringify(currentValue)} ${id}`);
        }

        this.value = currentValue;
        this.resolver(this.value);
    }

    public trySetResult(param: ParameterExpr<T>): boolean {
        if (this.value !== undefined) {
            return false;
        }

        this.value = createExpr(param);
        this.resolver(this.value);
        return true;
    }

    public isCompleted(): boolean {
        return this.value !== undefined;
    }

    public getResultAsync(): Promise<T> {
        return this._promise;
    }
}
