import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { BasicLayerService } from 'src/app/core/services/basic-layer.service';
import { DownloadService } from 'src/app/shared/services/download.service';
import { ExportPdfService } from '../../../core/services/export-pdf.service';
import { BasicLayer } from '../../../core/state/basic-layer.model';
import { Project } from '../../../core/state/project.actions';
import { ProjectModel } from '../../../core/state/project.model';
import { ProjectState } from '../../../core/state/project.state';
import { NewProjectDialogComponent } from '../new-project-dialog/new-project-dialog.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @ViewChild('import')
  importInput!: ElementRef;

  sub: Subscription = new Subscription();

  @Select(ProjectState.getProject)
  project$!: Observable<ProjectModel>;
  project?: ProjectModel

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private exportPdfService: ExportPdfService,
    private downloadService: DownloadService,
    private basicLayerService: BasicLayerService,
  ) { }

  ngOnInit(): void {
    this.sub.add(
      this.project$.subscribe((value) => {
        this.project = value;
      })
    )
  }

  createNewProject() {
    // Open project dialog...
    const dialogRef = this.dialog.open(NewProjectDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new Project.CreateProject(result.name, result.fabricColour, result.width, result.height));
      }
    })
  }

  exportProject() {
    if (!this.project) {
      return;
    }
    this.downloadService.downloadJson(JSON.stringify(this.project), `${this.project.name}.bitch`);
  }

  openImport() {
    this.importInput.nativeElement.click();
  }

  async importProject(e: Event) {
    // TODO - confirm dialog if there's a current project

    if (e.target instanceof HTMLInputElement) {
      // TODO actually put some checking in here...
      let file: File = (e.target as any).files[0];

      if (!file.name.endsWith('.bitch')) {
        return;
      }

      let fileText = await file.text();
      let fileJson = JSON.parse(fileText);

      let projectToImport: ProjectModel = fileJson;

      // make the layers into layer objects...
      // TODO: do this differently at some point...
      projectToImport.layers = projectToImport.layers.map((l) => {
        let bl = l as BasicLayer;
        let layer = this.basicLayerService.createEmptyLayer(bl.name, bl.crossstitches.length, bl.crossstitches[0].length);
        layer.crossstitches = bl.crossstitches;
        layer.backstitches = bl.backstitches;

        return layer;
      })

      // Import project
      this.store.dispatch(new Project.ImportProject(projectToImport));
    }
  }

  exportPdf() {
    this.exportPdfService.export(this.project!);
  }

}
