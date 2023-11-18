import { TestBed } from '@angular/core/testing';

import { WorkApplyService } from './work-apply.service';

describe('WorkApplyService', () => {
  let service: WorkApplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkApplyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
