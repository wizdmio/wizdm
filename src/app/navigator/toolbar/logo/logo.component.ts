import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core';
//import { ContentManager } from 'app/core';
//import { logoAnimations } from './logo-animations';

@Component({
  selector: 'wm-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']//,
  //animations: logoAnimations
})
export class LogoComponent implements OnInit {

  //private logo: string;

  constructor(/*private content: ContentManager*/) { }

  ngOnInit() {
    //this.logo = this.content.select("navigator.logo") as string;
  }
}
