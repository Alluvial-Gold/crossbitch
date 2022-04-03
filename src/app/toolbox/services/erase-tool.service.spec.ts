import { TestBed } from '@angular/core/testing';

import { EraseToolService } from './erase-tool.service';

describe('EraseToolService', () => {
  let service: EraseToolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EraseToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
