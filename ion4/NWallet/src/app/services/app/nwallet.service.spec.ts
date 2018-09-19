import { TestBed, inject } from '@angular/core/testing';

import { NWalletService } from './nwallet.service';

describe('NWService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NWalletService]
        });
    });

    it('should be created', inject([NWalletService], (service: NWalletService) => {
        expect(service).toBeTruthy();
    }));
});

