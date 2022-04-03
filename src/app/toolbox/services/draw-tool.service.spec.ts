import { TestBed } from '@angular/core/testing';

import { DrawToolService } from './draw-tool.service';

describe('DrawToolService', () => {
  let service: DrawToolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
