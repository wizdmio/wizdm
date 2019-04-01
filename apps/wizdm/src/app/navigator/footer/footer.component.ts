import { Component, Input } from '@angular/core';
import { LanguageOption } from '@wizdm/content';
import { ContentResolver } from '../../utils';

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
export class FooterComponent {
  
  readonly options: LanguageOption[];
  readonly msgs;

  // Returns the content manager as if it was injected in the contructor instead of the resolver
  private get content() { return this.resolver.content; }

  constructor(private resolver: ContentResolver) {

    // Gets the localized user messages from content service
    this.msgs = this.content.select('navigator.footer');
  
    // Local copy of the available language options to prevent the infinite loop bug to occur
    this.options = this.content.languageOptions();
  }

  // Flag enabling the multiple language selection
  @Input('language') multiLanguage: boolean = false;

  public get language(): string {
    return this.content.language;
  }

  public changeLanguage(lang: string) {

    // Switch to the selected language
    this.resolver.switchLanguage(lang);
  }
}
