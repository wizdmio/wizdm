import { Component, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserData } from 'app/auth/user-profile';
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
      
      const birth = moment.isMoment(value.birth) ? (value.birth as Moment).format(defaultFormat) : '';
      // Emits the update
      this.formValueChange.emit({ ...value, birth } as UserData);
    } );
  }

  ngOnDestroy() { !!this.sub && this.sub.unsubscribe(); }

  @Input('value') set formValue(value: UserData) { 

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
