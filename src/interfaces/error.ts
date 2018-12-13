import { Debug } from '../utils/helper/debug';

export enum Enumbase {}

export enum ResultCode {
    Unhanded = 0,
    Success = 1,
    ApiFailed = 2,
    UnAuth = 3
}

export class Enums {
    static getKey<T extends typeof Enumbase, K extends keyof T>(type: T, value: T[K]) {
        const enumName = Object.keys(type).find(key => type[key] === value);
        Debug.assert(enumName);
        return enumName;
    }
}
