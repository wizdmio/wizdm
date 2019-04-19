import { Component, Input } from '@angular/core';
import { ContentResolver } from '../../utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  
  readonly enableLanguageSelection$: Observable<boolean>;
  readonly options: LanguageData[];
  readonly language: LanguageData;
  readonly msgs;

  constructor(private resolver: ContentResolver) {

    // Gets the localized content pre-fetched by the resolver
    this.msgs = resolver.select('navigator.footer');

    // Gets a shortcut to the list of supported languages
    this.options = this.msgs.languages;
    // Seeks for the current language within the list
    this.language = this.options.find( opt => opt.value === resolver.language );

    // Maps an observable checking whenever the user language preference is available or not
    // so to show the language selection options accordingly
    this.enableLanguageSelection$ = resolver.user.asObservable()
      .pipe( map( profile => !profile || !profile.lang ) );
  }

  public changeLanguage(lang: string) {
    // Switch to the selected language
    this.resolver.switchLanguage(lang);
  }

}
