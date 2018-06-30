import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ContentManager, AuthService } from 'app/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';

@Component({
  selector: 'wm-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, AfterContentInit {

  private msgs = null;
  private cols = 1;

  private colsBreakpoint = {
    xl: 8,
    lg: 6,
    md: 4,
    sm: 2,
    xs: 1
  }

  private tiles = [
    { color: 'lightpink' },
    { color: 'lightblue' },
    { color: 'lightgreen' },
    { color: 'aquamarine' },
  ];

  constructor(private content: ContentManager,
              private auth: AuthService,
              private observableMedia: ObservableMedia) {}

  ngOnInit() {
    // Gets the localized content
    this.msgs = this.content.select('dashboard.projects');
  }

  ngAfterContentInit() {
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
      this.cols = this.colsBreakpoint[change.mqAlias];
    });
  }

}
