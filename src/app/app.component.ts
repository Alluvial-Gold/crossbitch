import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Project } from './core/state/project.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor(
    private store: Store
  ) {}

  ngOnInit(): void {
    // Temporary - create new project
    this.store.dispatch(new Project.CreateProject(89, 94));

  }
}
