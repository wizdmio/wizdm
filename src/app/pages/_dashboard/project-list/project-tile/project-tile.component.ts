import { Component, OnInit, Input } from '@angular/core';
import { ContentService, wmProject } from '../../../../core';

@Component({
  selector: 'wm-project-tile',
  templateUrl: './project-tile.component.html',
  styleUrls: ['./project-tile.component.scss']
})
export class ProjectTileComponent implements OnInit {

  @Input() project: wmProject;

  private msgs: any;

  constructor(private content: ContentService) { }

  ngOnInit() {
    // Gets the localized content
    this.msgs = this.content.select('dashboard.projects.tile');
  }
}
