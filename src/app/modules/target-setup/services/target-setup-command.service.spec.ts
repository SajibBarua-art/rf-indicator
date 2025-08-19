import { TestBed } from '@angular/core/testing';

import { TargetSetupCommandService } from './target-setup-command.service';

describe('TargetSetupCommandService', () => {
  let service: TargetSetupCommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TargetSetupCommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
