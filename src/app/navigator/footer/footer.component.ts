import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentManager } from 'app/core';

@Component({
  selector: 'wm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  private msgs;
  
  constructor(private content: ContentManager, 
              private router: Router) {}

  ngOnInit() {

    // Gets the localized user messages from content service
    this.msgs = this.content.select('navigator.footer');
  }

  changeLanguage(lang: string) {
    this.router.navigate(['/' + lang]);
    console.log("new language: " + lang);
  }
}
