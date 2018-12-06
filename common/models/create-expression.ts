export function createInstance<T>(param: T): T {
    const type = typeof param;
    if (type === 'function') {
        return createExpr(<any>param);
    } else {
        return createExpr(() => param);
    }
}

type ParameterExpr<T> = ((param?: T) => T | void) | T;
export { ParameterExpr };

export function createExpr<T>(expr: ParameterExpr<T>): T {
    let instance = <T>{};
    let result: any;
    if (typeof expr === 'function') {
        result = (<Function>expr)(instance);
    } else {
        instance = <T>expr;
    }

    return result === undefined ? instance : <T>result;
}

export function retrieveInstance(param: any): void {
    // todo201
}
