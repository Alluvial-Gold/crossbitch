import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor() { }

  /**
   * Downloads PDF file
   * @param pdfBytes PDF bytes
   * @param fileName File name
   */
  downloadPdf(pdfBytes: Uint8Array, fileName: string): void {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Downloads JSON file
   * @param json 
   * @param fileName 
   */
  downloadJson(json: string, fileName: string): void {
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  }
}
