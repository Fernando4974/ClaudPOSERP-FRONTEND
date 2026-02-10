import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { userExitGuard } from './user-exit.guard';

describe('userExitGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userExitGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
