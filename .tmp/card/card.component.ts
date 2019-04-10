import { Component, OnInit, HostBinding, Input, Output, EventEmitter, Inject } from '@angular/core';
import { wmFile } from '@wizdm/connect';
import { Project, wmProject  } from '../../../core';
import { wmColor, wmColorMap, COLOR_MAP } from '../../../shared/color-picker/colors';

@Component({
  selector: 'wm-project-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  constructor(@Inject(COLOR_MAP) private colorMap: wmColorMap) { }

  ngOnInit() {}

  @Input() tools: boolean = false;

  @Input() project: Project;

  // Accepts the color as an input
  private get color(): wmColor { 
    return this.colorMap[this.project.data.color || 'none'];
  }

  // Computes the color of the avatar based on the theme color
  public get avatarColor(): string {
    return this.color.color === 'none' 
      ? this.colorMap['grey'].value 
        : this.color.value;
  }

  // Applies the color value to the background style on the element directly
  @HostBinding('style.background-color') get background() { 
    return this.color.value;
  }

  // Applies the color contrast attribute for the text (same as wmThemeColor directive)
  @HostBinding('attr.wm-theme-contrast') get contrast() {
    return this.color.contrast;
  } 

  //@Output() update = new EventEmitter<wmProject>();

  public setColor(color: wmColor) {

    this.project.data.color = color.color;
    this.project.update({ color: color.color } as wmProject);

    //this.project.color = color.color;
    //this.update.emit({ id: this.project.id, color: color.color } as wmProject);
  }

  public selectCover(file: wmFile): void {

    this.project.data.cover = file.url || null;
    this.project.update({ id: this.project.id, cover: file.url || null } as wmProject);

    //this.project.cover = file.url || null;
    //this.update.emit({ id: this.project.id, cover: file.url || null } as wmProject);
  }
}
