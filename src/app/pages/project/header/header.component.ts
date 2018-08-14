import { Component, OnInit, Input } from '@angular/core';
import { ContentService, ProjectService, wmProject } from 'app/core';

@Component({
  selector: 'wm-project-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public msgs;

  @Input() project: wmProject;

  constructor(private content: ContentService) { 
    
    // Initialize the localized content
    this.msgs = this.content.select('project.header');
  }

  ngOnInit() {
  }

}
