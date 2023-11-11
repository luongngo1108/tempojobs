import { TestBed } from '@angular/core/testing';

import { DatastateService } from './datastate.service';

describe('DatastateService', () => {
  let service: DatastateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatastateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
