import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentManager, LanguageData } from 'app/content';

@Component({
  selector: 'wm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  private msgs;
  private languages: LanguageData[];
  private language: LanguageData;

  constructor(private content: ContentManager, 
              private router: Router) {}

  ngOnInit() {

    // Gets the localized user messages from content service
    this.msgs = this.content.select('navigator.footer');

     // Gets the list of available languages
     this.languages = this.content.languages();
     this.language = this.content.language();
  }

  changeLanguage(lang: string) {
    this.router.navigate(['/' + lang]);
    console.log("new language: " + lang);
  }
}
