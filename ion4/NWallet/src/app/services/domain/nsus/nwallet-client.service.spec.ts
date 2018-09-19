import { TestBed, inject } from '@angular/core/testing';

import { NWalletClientService } from './nwallet-client.service';

describe('NClientService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NWalletClientService]
        });
    });

    it('should be created', inject([NWalletClientService], (service: NWalletClientService) => {
        expect(service).toBeTruthy();
    }));
});
