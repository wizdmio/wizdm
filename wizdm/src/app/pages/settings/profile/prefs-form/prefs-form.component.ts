import { Component, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DarkModeObserver } from 'app/utils/platform';
import { UserData } from 'app/utils/user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wm-preferences-form',
  templateUrl: './prefs-form.component.html',
  styleUrls: ['./prefs-form.component.scss']
})
export class PreferencesFormComponent extends FormGroup implements OnDestroy {

  private data: Partial<UserData>;
  private sub: Subscription;
  
  constructor(private router: Router, private theme: DarkModeObserver) {
    
    // Builds the form controls
    super({ theme: new FormControl(''), lang: new FormControl('') });

    // Monitors the form group for changes
    this.sub = this.valueChanges.subscribe( value => {

      // Emits the value update
      this.formValueChange.emit(value);

      // Matches the new values against the original input data to reset the dirty flag in case they all match
      if(Object.keys(this.controls).every( key => this.data[key] === value[key] )) {
        Promise.resolve().then(() => this.markAsPristine() );
      }
    });
  }

  /** Applies the requested theme */
  public changeTheme(theme: string) {
    
    this.theme.darkMode( theme === 'auto' ? undefined : (theme === 'dark') );
  }

  /** Detects the current theme icon */
  public themeIcon(options: { icon, value }[]) {

    const value = this.theme.isDark ? 'dark' : 'light';

    return (options || []).find(icon => icon.value === value)?.icon;
  }

  /** Switches language */
  public changeLanguage(lang: string) {
    // Navigates towards this very same url but for the language code at the root
    return this.router.navigateByUrl( this.router.url.replace(/^\/[^\/]+(\/|$)/, '/' + lang + '$1') );
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  /** User preferences */
  @Input('value') set userData(value: Partial<UserData>) { 

    // Considers undefined/null theme as 'auto'
    if(!value.theme) { value.theme = 'auto'; }

    // Patches the user values
    this.patchValue(this.data = value);
  }

  /** Emits changes in user's preferences */
  @Output('valueChange') formValueChange = new EventEmitter<Partial<UserData>>();
}
