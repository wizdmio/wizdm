import { FormGroup, FormControl, AbstractControl, Validators, ValidationErrors } from '@angular/forms';
import { Component, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Users, UserData } from 'app/navigator/providers/user-profile';
import moment, { defaultFormat, Moment } from 'moment';
import {} from 'app/navigator/providers/user-profile'
import { Observable, Subscription } from "rxjs";
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'wm-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent extends FormGroup implements OnDestroy {

  private sub: Subscription;

  constructor(private users: Users) {
    // Builds the form controls
    super({
      userName : new FormControl('', Validators.compose( [ Validators.required, Validators.pattern(/^[\w\d-_]+\s*$/) ]) ),
      name     : new FormControl('', Validators.required ),
      motto    : new FormControl(''),
      email    : new FormControl('', Validators.email ),
      birth    : new FormControl(''),
      phone    : new FormControl(''),
      gender   : new FormControl(''),
      lang     : new FormControl('')
    });

    // Installs the userName async validator
    this.controls.userName.setAsyncValidators(this.userNameValidator);

    this.sub = this.valueChanges.subscribe( value => {      
      // Emits the update
      this.formValueChange.emit( this.format(value) );
    } );
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  private format(value: any): UserData {

    const birth = moment.isMoment(value?.birth) ? (value?.birth as Moment).format(defaultFormat) : '';

    return { ...value, birth };
  }

  private get userNameValidator() {
    
    // Returns a validator function async checking if the project name already exists
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      
      return this.users.doesUserNameExists( control.value )
        .pipe( map( exists => exists ? ({ exists: true }) : null ));
    };
  }

  get userData(): UserData { return this.format(this.value); }

  @Input('value') set userData(value: UserData) { 

    if(!value || value == this.value) { return; }

    // Turns the birthdate into a moment
    const birth = value.birth ? moment(value.birth, defaultFormat) : null;
    
    // Fills up the form with user data
    this.patchValue({ ...value, birth });

    // Force name the control validation when empty. This will build the search index as well
    if(!value.name) { this.controls.name.markAsTouched(); }

    // Force the name update whenever the searchIndex is missing
    else if(!value.searchIndex) { this.controls.name.markAsDirty(); }

    // Force userName control validation when empty
    if(!value.userName) { this.controls.userName.markAsTouched(); }
  }

  @Output('valueChange') formValueChange = new EventEmitter<UserData>();

  public genderIcon(options: { icon, value }[]) {

    return options.find(icon => icon.value === this.value?.gender)?.icon;
  }
}
