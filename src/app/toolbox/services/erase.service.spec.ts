import { TestBed } from '@angular/core/testing';

import { EraseService } from './erase.service';

describe('EraseService', () => {
  let service: EraseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EraseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
