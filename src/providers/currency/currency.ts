import { Logger } from '../common/logger/logger';
import { Injectable } from '@angular/core';

@Injectable()
export class CurrencyProvider {
    // injected by http module


    constructor(private logger: Logger) {
        this.logger;
        this.sync();
    }

    private sync(): void {

    }


}
