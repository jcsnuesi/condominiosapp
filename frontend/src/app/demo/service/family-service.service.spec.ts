import { TestBed } from '@angular/core/testing';

import { FamilyServiceService } from './family-service.service';

describe('FamilyServiceService', () => {
  let service: FamilyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
