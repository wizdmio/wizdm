import { FormGroup, FormControl, AbstractControl, Validators, ValidationErrors } from '@angular/forms';
import { Component, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Observable, Subscription, BehaviorSubject, of } from 'rxjs';
import { map, take, debounceTime, switchMap } from 'rxjs/operators';
import { UserProfile, UserData } from 'app/utils/user';
import moment, { defaultFormat, Moment } from 'moment';

@Component({
  selector: 'wm-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent extends FormGroup implements OnDestroy {

  private data: Partial<UserData>;
  private sub: Subscription;

  /** The current host origin */
  get hostname(): string { return window?.location?.origin || 'https:\/\/wizdm.io'; }

  constructor(private user: UserProfile) {
    // Builds the form controls
    super({
      userName : new FormControl('', Validators.compose( [ Validators.required, Validators.pattern(/^[\w\d-_]+\s*$/) ]) ),
      name     : new FormControl('', Validators.required ),
      lastName : new FormControl(''),
      bio      : new FormControl(''),
      email    : new FormControl('', Validators.email ),
      birth    : new FormControl(''),
      phone    : new FormControl(''),
      location : new FormControl(''),
      gender   : new FormControl(''),
      //lang     : new FormControl('')
    });

    // Installs the userName async validator
    this.controls.userName.setAsyncValidators(this.userNameValidator);

    // Monitors the form group for changes
    this.sub = this.valueChanges.subscribe( value => {      

      // Formats the output data 
      const out = this.format(value);
      
      // Emits the update
      this.formValueChange.emit(out);

      // Matches the new values against the original input data to reset the dirty flag in case they all match
      if(Object.keys(this.controls).every( key => this.data[key] === out[key] )) {
        Promise.resolve().then(() => this.markAsPristine() );
      }
    });
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  private format(value: any): UserData {

    const birth = moment.isMoment(value?.birth) ? (value?.birth as Moment).format(defaultFormat) : '';

    return { ...value, birth };
  }

  private get userNameValidator() {
    
    const value$ = new BehaviorSubject<string>('');
    const result$ = value$.pipe(
      debounceTime(500),
      switchMap( value => value ? this.user.doesUserNameExists( value, true ) : of(false) ),
      map( exists => exists ? ({ exists: true }) : null ),
      take(1)
    );
    
    // Returns a validator function async checking if the project name already exists
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return value$.next(control.value), result$;
    };
  }

  get userData(): UserData { return this.format(this.value); }

  @Input('value') set userData(value: Partial<UserData>) { 

    //if(!value || value == this.value) { return; }

    // Turns the birthdate into a moment
    const birth = value.birth ? moment(value.birth, defaultFormat) : null;

    // Replaces the old 'motto' with the new 'bio' field
    if(value.motto && !value.bio) { value.bio = value.motto; }

    // Keeps track of the original input data
    this.data = value;
    
    // Fills up the form with user data
    this.patchValue({ ...value, birth });

    // Force userName control validation when empty
    if(!value.userName) { Promise.resolve().then(() => this.controls.userName.markAsTouched()); }

    // Force name control validation when fullName is empty. This will build the search index as well
    if(!value.fullName) { Promise.resolve().then(() => this.controls.name.markAsTouched()); }

    // Force the name update whenever the searchIndex is missing
    else if(!value.searchIndex) { Promise.resolve().then(() => this.controls.name.markAsDirty()); }
  }

  @Output('valueChange') formValueChange = new EventEmitter<Partial<UserData>>();

  public genderIcon(options: { icon, value }[]) {

    return (options || []).find(icon => icon.value === this.value?.gender)?.icon;
  }
}
