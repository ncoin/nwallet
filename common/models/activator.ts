import { ParameterExpr, createExpr } from '.';

export class Activator {
    public static crteateInstance<T>(a: { new (...args: any[]): T }, expr?: ParameterExpr<T>) {
        // let instance = Object.create(window[a.name], a.prototype);

        let instance = new a(); // args??
        instance = Object.assign(instance, createExpr(expr));
        return instance;
    }
}
