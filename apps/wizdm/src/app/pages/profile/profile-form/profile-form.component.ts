import { Component, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { wmMember } from 'app/core/member';
import { Subscription } from "rxjs";
import moment from 'moment';

@Component({
  selector: 'wm-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent extends FormGroup implements OnDestroy {

  private sub: Subscription;
  //readonly form: FormGroup;

  //get modified(): boolean { return this.form.touched; }

  constructor(/*builder: FormBuilder*/) {
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

    // Builds the form controls group
    /*this.form = builder.group({
      name   : ['', Validators.required ],
      motto  : [''],
      email  : ['', Validators.email ],
      birth  : [''],
      phone  : [''],
      gender : [''],
      lang   : [''],
    });*/

    this.sub = this.valueChanges.subscribe( value => this.submit(value) );
  }

  ngOnDestroy() { !!this.sub && this.sub.unsubscribe(); }

  @Input('value') set formValue(value: wmMember) { 

     if(!value) { return; }

    // Turns the birthdate into a moment
    const birth = value.birth ? moment(value.birth, moment.defaultFormat) : null;
    // Fills up the form with user data
    this.patchValue({ ...value, birth });
    // Marks the form as pristine right after the view updated
    Promise.resolve().then( () => this.markAsPristine() );
  }

  public genderIcon(options: { icon, value }[]) {

    const gender = options.find(g => this.value.gender === g.value);
    return gender && gender.icon;
  }

  public submit(value: wmMember) {

    // Birthday: turns the moment object to a string
    const birth = moment.isMoment(value.birth) ? value.birth.format(moment.defaultFormat) : '';
    // Emits the update
    this.formValueChange.emit({ ...value, birth } as wmMember);
  }

  @Output('valueChange') formValueChange = new EventEmitter<wmMember>();
}
