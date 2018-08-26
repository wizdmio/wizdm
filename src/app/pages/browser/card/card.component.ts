import { Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { wmProject, wmColor, wmUserFile, Timestamp } from 'app/core';

@Component({
  selector: 'wm-project-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input() project: wmProject;

  @Input() tools: boolean = false;

  constructor() {}

  @HostBinding('style.background-color') get bkcolor() {
    return this.project && this.project.color && this.project.color.value;
  }
  
  @HostBinding('style.color') get color() {
    return this.project && this.project.color && this.project.color.contrast;
  } 

  @Output() update = new EventEmitter<wmProject>();

  public setColor(color: wmColor) {

    //this.project.color = color;
    this.update.emit({ id: this.project.id, color: color } as wmProject);
  }

  public selectCover(file: wmUserFile): void {

    //this.project.cover = file.url || null;
    this.update.emit({ id: this.project.id, cover: file.url || null } as wmProject);
  }
}
