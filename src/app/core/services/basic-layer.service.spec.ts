import { TestBed } from '@angular/core/testing';

import { BasicLayerService } from './basic-layer.service';

describe('BasicLayerService', () => {
  let service: BasicLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
