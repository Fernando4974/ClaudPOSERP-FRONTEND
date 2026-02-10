import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { deactivetokenGuard } from './deactivetoken.guard';

describe('deactivetokenGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => deactivetokenGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
