import { env } from '../../environments/environment.stage';
import { isDevMode } from '@angular/core';

export class Debug {
    /** property validation check */
    static Validate(obj: any): void {
        Object.keys(obj).forEach(key => {
            if (obj[key] === undefined) {
                if (isDevMode()) {
                    console.log('[debug-valid]', obj);
                    throw new Error('[debug-valid] validation error. check console');
                } else {
                }
            }
        });
    }

    static Clear(obj: any): void {
        Object.keys(obj).forEach(key => {
            obj[key] = undefined;
        });
    }

    static assert(condition: any, ...params: any[]): void {
        if (!condition) {
            if (isDevMode()) {
                console.log('[debug-assert]', ...params);
                throw new Error('[debug-assert] assertion error. check console');
            } else {
            }
        }
    }
}
