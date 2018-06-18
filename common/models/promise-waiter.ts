import { ParameterExpr, createExpr } from './create-expression';
/**
 * deferred promise (simplified)
 */
export class PromiseWaiter<T> {

    public nonce: string;
    private resolver: (value?: T | PromiseLike<T>) => void;
    private promise: Promise<T>;
    private value: T = undefined;

    public constructor(timeout: number = 0) {
        this.promise = new Promise<T>(resolve => {
            this.resolver = resolve;
        });
    }

    public set(param: ParameterExpr<T>): void {

        if (this.value !== undefined) {
            throw new Error(`value already assigned = ${this.value}`);
        }

        this.value = createExpr(param);
        this.resolver(this.value);
    }

    public trySet(param: ParameterExpr<T>): boolean {
        if (this.value !== undefined) {
            return false;
        }

        this.value = createExpr(param);
        this.resolver(this.value);
        return true;
    }

    public result(): Promise<T> {
        return this.promise;
    }
}
