import { Injectable } from '@angular/core';
import { ProjectModel } from '../state/project.model';
import { PDFDocument, StandardFonts, rgb, PDFPage, grayscale, RGB } from 'pdf-lib'
import { BasicLayer } from '../state/basic-layer.model';

@Injectable({
  providedIn: 'root'
})
export class ExportPdfService {

  constructor() { }

  async export(project: ProjectModel) {
    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  
    const page = pdfDoc.addPage()
    await this.createFrontPage(project, page, timesRomanFont, timesRomanBoldFont);

    this.drawPattern(project, pdfDoc);

    const pdfBytes = await pdfDoc.save()
    this.export2(pdfBytes);
  }

  // TODO put this somewhere else
  private export2(pdfBytes: Uint8Array) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "export.pdf";
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  }

  private async createFrontPage(project: ProjectModel, page: PDFPage, font: any, boldFont: any) {
    const { width, height } = page.getSize();

    // Project name
    let titleFontSize = 30;
    page.drawText('[TODO: Project Name]', {
      x: 50,
      y: height - 2 * titleFontSize,
      size: titleFontSize,
      font: font,
    })

    // Project size
    let yDelta = 100;

    let smallFontSize = 12;
    page.drawText('Grid Size:', {
      x: 50,
      y: height - yDelta,
      size: smallFontSize,
      font: boldFont,
    });
    page.drawText(`${project.canvasSettings.rows}W x ${project.canvasSettings.columns}H`, {
      x: 200,
      y: height - yDelta,
      size: smallFontSize,
      font: font,
    });

    // Palette - cross stitch
    page.moveTo(50, height - 150);
    page.drawText('Key', {
      x: 50,
      font: boldFont,
      size: smallFontSize
    });

    // TODO - get stitch number for each, don't include ones with 0.
    // TODO - two columns?
    page.moveDown(20);
    page.setFont(font);
    page.setFontSize(smallFontSize);

    for (let i = 0; i < project.palette.length; i++) {
      let paletteEntry = project.palette[i];
      let currentY = page.getY();

      // Draw box
      let colour = this.hexToRgb(paletteEntry.floss.colour);
      page.drawRectangle({
        x: 50,
        y: currentY - 2,
        width: 10,
        height: 10,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
        color: colour ? rgb( colour.r, colour.g, colour.b) : rgb(0, 0, 0),
      })

      // Strands
      page.drawText(`[${paletteEntry.strands}]`, {
        x: 70,
      });

      // Description
      page.drawText(`${paletteEntry.floss.description}`, {
        x: 90, 
      });

      // Stitches
      page.drawText(`X stitches`, {
        x: 250, 
      });

      page.moveDown(20);
    }

    // Palette - back stitch
    // TODO
  }

  private hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 256,
      g: parseInt(result[2], 16) / 256,
      b: parseInt(result[3], 16) / 256
    } : null;
  }

  private drawPattern(project: ProjectModel, pdfDoc: PDFDocument) {
    // TODO - split across pages...
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    let startX = 50;
    let startY = height - 50;
    let squareSize = 10;

    // palette colour map
    let colourMap = new Map<number, RGB>();
    project.palette.forEach((p, i) => {
      let colour = this.hexToRgb(p.floss.colour);
      let rgbColour: RGB = colour ? rgb( colour.r, colour.g, colour.b) : rgb(0, 0, 0);
      colourMap.set(i, rgbColour);
    })

    let layer = project.layers[0];
    if (layer instanceof BasicLayer) {
      
      for (let rowIdx = 0; rowIdx < layer.crossstitches[0].length; rowIdx++) {
        for (let colIdx = 0; colIdx < layer.crossstitches.length; colIdx++) {
          let val = layer.crossstitches[colIdx][rowIdx];

          if (typeof(val) == 'number' && val != -1) {
            let rgbColour = colourMap.get(val) ?? rgb(0, 0, 0);
            page.drawRectangle({
              x: startX + (rowIdx * squareSize ),
              y: startY - ((colIdx + 1) * squareSize), // x, y positions...?
              width: squareSize,
              height: squareSize,
              color: rgbColour
            })
          }
          // TODO partial stitches
        }
      }

      // TODO backstitch

    }

    // TODO - grid
    let gridWidth = project.canvasSettings.columns * squareSize;
    let gridHeight = project.canvasSettings.rows * squareSize;

    for (let x = 0; x < project.canvasSettings.columns + 1; x++) {
      page.drawLine({
        start: {
          x: startX + x * squareSize,
          y: startY 
        },
        end: {
          x: startX + x * squareSize,
          y: startY - gridHeight
        },
        thickness: x % 10 == 0 ? 2 : 1
      })
    }

    for (let y = 0; y < project.canvasSettings.rows + 1; y++) {
      page.drawLine({
        start: {
          x: startX,
          y: startY - y * squareSize
        },
        end: {
          x: startX + gridWidth,
          y: startY - y * squareSize
        },
        thickness: y % 10 == 0 ? 2 : 1
      })
    }
  }

}
