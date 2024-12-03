import { TestBed } from '@angular/core/testing';

import { HabitGridService } from './habitgrid.service';

describe('HabitgridService', () => {
  let service: HabitGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HabitGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
