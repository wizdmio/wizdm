import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ContentService, ProjectService, wmProject } from '../../../core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription, Observable } from 'rxjs';
import {  map, filter, take, delay } from 'rxjs/operators';

@Component({
  selector: 'wm-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, AfterContentInit {

  private msgs = null;
  
  private colsBreakpoint = { xl: 8, lg: 6, md: 4, sm: 2, xs: 1}
  private cols = 1;

  private projects$: Observable<wmProject[]>;

  constructor(private content: ContentService,
              private projects: ProjectService,
              private observableMedia: ObservableMedia) {}

  ngOnInit() {
    // Gets the localized content
    this.msgs = this.content.select('dashboard.projects');

    // Lists the projects I'm the owner of
    this.projects$ = this.projects.listOwnProjects();
  }

  ngAfterContentInit() {
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
      this.cols = this.colsBreakpoint[change.mqAlias];
    });
  }
}
