import { Component, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserData } from 'app/core/user-profile';
import moment, { defaultFormat, Moment } from 'moment';
import { Subscription } from "rxjs";

@Component({
  selector: 'wm-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent extends FormGroup implements OnDestroy {

  private sub: Subscription;

  constructor() {
    // Builds the form controls
    super({
      name   : new FormControl('', Validators.required ),
      motto  : new FormControl(''),
      email  : new FormControl('', Validators.email ),
      birth  : new FormControl(''),
      phone  : new FormControl(''),
      gender : new FormControl(''),
      lang   : new FormControl('')
    });

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

  get userData(): UserData { return this.format(this.value); }

  @Input('value') set userData(value: UserData) { 

    if(!value || value == this.value) { return; }

    // Turns the birthdate into a moment
    const birth = value.birth ? moment(value.birth, defaultFormat) : null;
    
    // Fills up the form with user data
    this.patchValue({ ...value, birth });
    
    // Marks the form as pristine right after the view updated
    Promise.resolve().then( () => this.markAsPristine() );
  }

  @Output('valueChange') formValueChange = new EventEmitter<UserData>();

  public genderIcon(options: { icon, value }[]) {

    return options.find(icon => icon.value === this.value?.gender)?.icon;
  }
}
