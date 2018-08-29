import { Component, HostBinding, Input, Output, EventEmitter, Inject } from '@angular/core';
import { wmProject, wmColor, wmUserFile, wmColorMap, COLOR_MAP  } from 'app/core';

@Component({
  selector: 'wm-project-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input() project: wmProject;

  @Input() tools: boolean = false;

  constructor(@Inject(COLOR_MAP) private colorMap: wmColorMap) { }

  // Accepts the color as an input
  private get color(): wmColor { 
    return this.colorMap[this.project.color || 'none'];
  }

  // Computes the color of the avatar based on the theme color
  public get avatarColor(): string {
    return this.color.color === 'none' 
      ? this.colorMap['grey'].value 
        : this.color.value;
  }

  // Applies the color value to the background style on the element directly
  @HostBinding('style.background-color') get background() { 
    return this.color;
  }

  // Applies the color contrast attribute for the text (same as wmThemeColor directive)
  @HostBinding('attr.wm-theme-contrast') get contrast() {
    return this.color.contrast;
  } 

  @Output() update = new EventEmitter<wmProject>();

  public setColor(color: wmColor) {

    //this.project.color = color;
    this.update.emit({ id: this.project.id, color: color.color } as wmProject);
  }

  public selectCover(file: wmUserFile): void {

    //this.project.cover = file.url || null;
    this.update.emit({ id: this.project.id, cover: file.url || null } as wmProject);
  }
}
