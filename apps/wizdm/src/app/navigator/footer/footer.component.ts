import { Component, Input } from '@angular/core';
import { ContentResolver } from '../../utils';

interface LanguageData {

  value: string,
  label: string,
  image: string
};

@Component({
  selector: 'wm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  
  readonly options: LanguageData[];
  readonly language: LanguageData;
  readonly msgs;

  // Flag enabling the multiple language selection
  @Input('language') multiLanguage: boolean = false;

  constructor(private resolver: ContentResolver) {

    // Gets the localized content pre-fetched by the resolver
    this.msgs = resolver.select('navigator.footer');
    // Gets a shortcut to the list of supported languages
    this.options = this.msgs.languages;
    // Seeks for the current language within the list
    this.language = this.options.find( opt => opt.value === resolver.language );
  }

  public changeLanguage(lang: string) {
    // Switch to the selected language
    this.resolver.switchLanguage(lang);
  }
}
