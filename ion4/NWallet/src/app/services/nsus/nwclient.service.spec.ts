import { TestBed, inject } from '@angular/core/testing';

import { NClientService } from './nwclient.service';

describe('NClientService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NClientService]
        });
    });

    it('should be created', inject([NClientService], (service: NClientService) => {
        expect(service).toBeTruthy();
    }));
});
