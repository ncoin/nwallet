import { Injectable } from '@angular/core';
import { Logger } from '../common/logger/logger';

export interface Configuration {
    touchId: any;
}

@Injectable()
export class ConfigProvider {
    constructor(private logger: Logger){
        this.logger;
    }
}
