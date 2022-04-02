import { Injectable } from '@angular/core';
import { ProjectModel } from '../state/project.model';
import { PDFDocument, StandardFonts, rgb, PDFPage, RGB, RotationTypes, PDFFont } from 'pdf-lib'
import { BasicLayer } from '../state/basic-layer.model';
import { Icons } from 'src/app/shared/icons.constants';
import { Lines } from 'src/app/shared/lines.constants';
import { DownloadService } from 'src/app/shared/services/download.service';

interface ExportSettings {
  font: PDFFont,
  boldFont: PDFFont
}

@Injectable({
  providedIn: 'root'
})
export class ExportPdfService {

  constructor(
    private downloadService: DownloadService
  ) { }

  async export(project: ProjectModel) {
    const pdfDoc = await PDFDocument.create();

    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const settings: ExportSettings = {
      font: font,
      boldFont: boldFont
    };
  
    // Front page
    await this.createFrontPage(project, pdfDoc, settings);

    // Pattern
    this.drawPattern(project, pdfDoc, settings);

    // Download
    const pdfBytes = await pdfDoc.save();
    const name = `${project.name} export.pdf`
    this.downloadService.downloadPdf(pdfBytes, name);
  }

  private async createFrontPage(project: ProjectModel, pdfDoc: PDFDocument, settings: ExportSettings) {
    const page = pdfDoc.addPage();
    const { height } = page.getSize();

    const startX = 50;
    const titleFontSize = 30;
    const smallFontSize = 12;

    // Project name
    page.moveTo(startX, height - 2 * titleFontSize);
    page.drawText(project.name, {
      size: titleFontSize,
      font: settings.font,
    })

    page.setFontSize(smallFontSize);

    // Project details
    page.moveDown(50);
    page.drawText('Grid Size:', {
      x: startX,
      font: settings.boldFont,
    });
    page.drawText(`${project.canvasSettings.rows}W x ${project.canvasSettings.columns}H`, {
      x: 200,
      font: settings.font,
    });

    // Palette - cross stitch
    page.moveDown(40);
    page.drawText('Key', {
      x: startX,
      font: settings.boldFont,
    });

    page.moveDown(20);
    page.setFont(settings.font);
    page.setFontSize(smallFontSize);

    for (let i = 0; i < project.palette.length; i++) {
      let paletteEntry = project.palette[i];
      let currentY = page.getY();

      // Draw box
      page.drawRectangle({
        x: 50,
        y: currentY - 3,
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
        color: rgb(1, 1, 1),
      })

      // Draw symbol
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

      // TODO - get stitch number for each, don't include ones with 0.
      // Stitches
      // page.drawText(`X stitches`, {
      //   x: 250, 
      // });

      page.moveDown(20);
    }

    // Palette - back stitch
    // TODO
  }

  private drawPattern(project: ProjectModel, pdfDoc: PDFDocument, settings: ExportSettings) {
    let page = pdfDoc.addPage();
    const { height } = page.getSize();

    let startX = 50;
    let startY = height - 50;
    let squareSize = 10;

    // Palette colour map
    let colourMap = new Map<number, RGB>();
    project.palette.forEach((p, i) => {
      let colour = this.hexToRgb(p.floss.colour);
      let rgbColour: RGB = colour ? rgb( colour.r, colour.g, colour.b) : rgb(0, 0, 0);
      colourMap.set(i, rgbColour);
    });

    // Palette icon map
    let icons = Icons;
    let iconMap = new Map<number, string>();
    project.palette.forEach((p, i) => {
      let iconPath = icons[p.iconIndex].path;
      iconMap.set(i, iconPath);
    });

    // Palette backstitch line map
    let lines = Lines;
    let lineMap = new Map<number, number>();
    project.palette.forEach((p, i) => {
      let thickness = lines[p.lineIndex].thickness;
      lineMap.set(i, thickness);
    });

    // Cross stitch drawing
    let layer = project.layers[0];
    if (layer instanceof BasicLayer) {
      for (let rowIdx = 0; rowIdx < layer.crossstitches[0].length; rowIdx++) {
        for (let colIdx = 0; colIdx < layer.crossstitches.length; colIdx++) {
          let val = layer.crossstitches[colIdx][rowIdx];

          if (typeof(val) == 'number' && val != -1) {
            //let rgbColour = colourMap.get(val) ?? rgb(0, 0, 0);
            // page.drawRectangle({
            //   x: startX + (rowIdx * squareSize ),
            //   y: startY - ((colIdx + 1) * squareSize), // x, y positions...?
            //   width: squareSize,
            //   height: squareSize,
            //   color: rgbColour
            // })

            // Draw symbol
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
    }

    // Grid
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

    // Backstitch
    if (layer instanceof BasicLayer) {
      for (let bIdx = 0; bIdx < layer.backstitches.length; bIdx++) {
        let backstitch = layer.backstitches[bIdx];
  
        page.drawLine({
          start: {
            x: startX + backstitch.startX * squareSize,
            y: startY - backstitch.startY * squareSize
          },
          end: {
            x: startX + backstitch.endX * squareSize,
            y: startY - backstitch.endY * squareSize
          },
          thickness: lineMap.get(backstitch.paletteIdx) ?? 1,
          color: colourMap.get(backstitch.paletteIdx) ?? rgb(0, 0, 0)
        });
      }
    }

    // Numbers
    page.setFontSize(10);
    page.setFont(settings.font);

    for (let x = 10; x < project.canvasSettings.columns + 1; x += 10) {
      page.drawText(x.toString(), {
        x: startX + x * squareSize - 5,
        y: startY + 5,
      });
    }

    for (let y = 10; y < project.canvasSettings.rows + 1; y += 10) {
      page.drawText(y.toString(), {
        x: startX - 5,
        y: startY - y * squareSize - 5,
        rotate: {
          angle: 90,
          type: RotationTypes.Degrees
        }
      });
    }

    // Center arrows
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


  /**
   * Convert hex string to rgb (0 - 1)
   * @param hex Hex string #rrggbb
   * @returns r, g, b values
   */
  private hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 256,
      g: parseInt(result[2], 16) / 256,
      b: parseInt(result[3], 16) / 256
    } : null;
  }

}
