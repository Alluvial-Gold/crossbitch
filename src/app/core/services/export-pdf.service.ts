import { Injectable } from '@angular/core';
import { ProjectModel } from '../state/project.model';
import { PDFDocument, StandardFonts, rgb, PDFPage, grayscale, RGB, RotationTypes } from 'pdf-lib'
import { BasicLayer } from '../state/basic-layer.model';
import { Icons } from 'src/app/shared/icons.constants';

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

    this.drawPattern(project, pdfDoc, timesRomanFont);

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
    page.drawText(project.name, {
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
        y: currentY - 3,
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
        //color: colour ? rgb( colour.r, colour.g, colour.b) : rgb(0, 0, 0),
        color: rgb(1, 1, 1),
      })

      // Draw symbol..
      let icons = Icons;
      page.drawSvgPath(
        icons[paletteEntry.iconIndex].path,
        {
          x: 50 + 1,
          y: currentY + 8,
          scale: 0.1,
          color: rgb(0, 0, 0)
        }
      );

      // Strands
      page.drawText(`[${paletteEntry.crossStitchStrands}]`, {
        x: 70,
      });

      // Description
      page.drawText(`${paletteEntry.floss.description}`, {
        x: 90, 
      });

      // Stitches
      // page.drawText(`X stitches`, {
      //   x: 250, 
      // });

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

  private drawPattern(project: ProjectModel, pdfDoc: PDFDocument, font: any) {
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
    });

    // palette icon map
    let icons = Icons;
    let iconMap = new Map<number, string>();
    project.palette.forEach((p, i) => {
      let iconPath = icons[p.iconIndex].path;
      iconMap.set(i, iconPath);
    })

    let layer = project.layers[0];
    if (layer instanceof BasicLayer) {
      
      for (let rowIdx = 0; rowIdx < layer.crossstitches[0].length; rowIdx++) {
        for (let colIdx = 0; colIdx < layer.crossstitches.length; colIdx++) {
          let val = layer.crossstitches[colIdx][rowIdx];

          if (typeof(val) == 'number' && val != -1) {
            let rgbColour = colourMap.get(val) ?? rgb(0, 0, 0);
            // page.drawRectangle({
            //   x: startX + (rowIdx * squareSize ),
            //   y: startY - ((colIdx + 1) * squareSize), // x, y positions...?
            //   width: squareSize,
            //   height: squareSize,
            //   color: rgbColour
            // })

            // Draw symbol..
            let iconPath = iconMap.get(val) ?? icons[0].path;
            page.drawSvgPath(
              iconPath,
              {
                x: startX + (rowIdx  * squareSize) + 1,
                y: startY - (colIdx * squareSize) - 1,
                scale: 0.08,
                color: rgb(0, 0, 0)
              }
            );
          }
          // TODO partial stitches
        }
      }

      // TODO backstitch

    }

    // grid
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
        thickness: 1,
        opacity: x % 10 == 0 ? 1 : 0.2
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
        thickness: 1,
        opacity: y % 10 == 0 ? 1 : 0.2
      })
    }

    // numbers
    let numberSize = 10;
    for (let x = 10; x < project.canvasSettings.columns + 1; x += 10) {
      page.drawText(x.toString(), {
        x: startX + x * squareSize - 5,
        y: startY + 5,
        font: font,
        size: numberSize
      });
    }

    for (let y = 10; y < project.canvasSettings.rows + 1; y += 10) {
      page.drawText(y.toString(), {
        x: startX - 5,
        y: startY - y * squareSize - 5,
        font: font,
        size: numberSize,
        rotate: {
          angle: 90,
          type: RotationTypes.Degrees
        }
      });
    }

    // center arrows
    page.drawSvgPath('M 0 0 L 10 0 L 5 20 Z', {
      x: startX + gridWidth / 2 - 5,
      y: startY + 20,
      color: rgb(0, 0, 0),
      opacity: 0.2
    })

    page.drawSvgPath('M 0 0 L 0 10 L 20 5 Z', {
      x: startX - 20,
      y: startY - gridHeight / 2 + 5,
      color: rgb(0, 0, 0),
      opacity: 0.2
    })

    // TODO - smaller key
  }

}
