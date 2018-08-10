import { Component, OnInit } from '@angular/core';
import { ContentService, LanguageOption, AuthService } from 'app/core';

export interface LanguageData {

  lang: string,
  path: string,
  label: string,
  image: string,
  default?: boolean;
};

@Component({
  selector: 'wm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  
  private _options: LanguageOption[];
  public msgs;

  constructor(private content: ContentService,
              private auth: AuthService,) {}

  ngOnInit() {

    // Gets the localized user messages from content service
    this.msgs = this.content.select('navigator.footer');

    // Local copy of the available language options to prevent the infinite loop bug to occur
    this._options = this.content.languageOptions;
  }

  public get signedIn(): boolean {
    return this.auth.authenticated;
  }

  public get options(): LanguageOption[] {
    
    // WARNING: we buffers languageOptions into a local variable to prevent
    // the *ngFor on mat-select to run over an infinite loop due to an issue
    // it seems they still can't fix
    //return this.content.languageOptions;
    return this._options;
  }

  public get language(): string {
    return this.content.language;
  }

  public changeLanguage(lang: string) {

    // Switch to the selected language
    this.content.switch(lang);
  }
}
