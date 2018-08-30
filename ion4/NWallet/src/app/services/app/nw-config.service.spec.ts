import { TestBed, inject } from '@angular/core/testing';

import { NWConfigService } from './nw-config.service';

describe('NWConfigService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NWConfigService]
        });
    });

    it('should be created', inject([NWConfigService], (service: NWConfigService) => {
        expect(service).toBeTruthy();
    }));
});
