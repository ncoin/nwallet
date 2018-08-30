import { TestBed, inject } from '@angular/core/testing';

import { NWService } from './nw.service';

describe('NWService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NWService]
        });
    });

    it('should be created', inject([NWService], (service: NWService) => {
        expect(service).toBeTruthy();
    }));
});
