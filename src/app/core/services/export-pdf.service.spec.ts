import { TestBed } from '@angular/core/testing';

import { ExportPdfService } from './export-pdf.service';

describe('ExportPdfService', () => {
  let service: ExportPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
