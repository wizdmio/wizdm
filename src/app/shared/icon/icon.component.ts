import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wm-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  private fontSet: string  = undefined;
  private fontIcon: string = undefined;
  private matIcon = "code";

  constructor() { }

  ngOnInit() {
  }

  @Input() color: string = undefined;
  @Input() inline: boolean = undefined;

  @Input('icon') set setIcon(descriptor: string) {
   
    let segments = descriptor.split(':');
    
    if(segments.length >1) {
      
      this.matIcon  = "";
      this.fontSet  = segments[0];
      this.fontIcon = segments[1];
    }
    else {
      
      this.fontSet = this.fontIcon = undefined;
      this.matIcon = segments[0];
    }
  }
}
