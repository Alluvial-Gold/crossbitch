import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { PaletteComponent } from 'src/app/sidebar/components/palette/palette.component';
import { Tools } from 'src/app/toolbox/interfaces/tool.interface';
import { ToolboxModes } from 'src/app/toolbox/interfaces/toolbox-mode.interface';
import { ExportPdfService } from '../../services/export-pdf.service';
import { BasicLayer } from '../../state/basic-layer.model';
import { Project } from '../../state/project.actions';
import { ProjectModel } from '../../state/project.model';
import { ProjectState } from '../../state/project.state';
import { Settings } from '../../state/settings.actions';
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
    private exportPdfService: ExportPdfService
  ) { }

  ngOnInit(): void {
    this.sub.add(
      this.project$.subscribe((value) => {
        this.project = value;
      })
    )
  }

  createNewProject() {
    console.log('new project...');

    // Open project dialog...
    const dialogRef = this.dialog.open(NewProjectDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new Project.CreateProject(result.width, result.height));
        this.store.dispatch(new Settings.SelectToolboxMode(ToolboxModes.Crossstitch));
        this.store.dispatch(new Settings.SelectTool(Tools.Draw));
      }
    })
  }

  exportProject() {
    if (!this.project) {
      return;
    }

    const blob = new Blob([JSON.stringify(this.project)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "project.bitch";
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
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
        let layer = new BasicLayer(bl.name, bl.crossstitches.length, bl.crossstitches[0].length);
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
