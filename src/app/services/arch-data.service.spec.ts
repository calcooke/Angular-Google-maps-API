import { TestBed } from '@angular/core/testing';

import { ArchDataService } from './arch-data.service';

describe('ArchDataService', () => {
  let service: ArchDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArchDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
