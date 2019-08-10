import { Component, OnDestroy, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { PopupService } from '../../../elements/popup';
import { ProjectService, ProjectWrapper, wmProject  } from '../../../core/project';
import { $animations } from './projects.animations';
//import moment from 'moment';

@Component({
  selector: 'wm-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  host: { 'class': 'mat-elevation-z1' },
  animations: $animations
})
export class ProjectComponent extends ProjectWrapper implements OnDestroy {

  @ViewChild('formTemplate', { static: true }) 
  private tmplDialog: TemplateRef<ProjectComponent>;
  private refDialog: MatDialogRef<ProjectComponent>;

  readonly form: FormGroup;

  // Project Name Validator Factory 
  get projectNameValidator() {
    
    // Returns a validator function async checking if the project name already exists
    return (control: AbstractControl): Promise<{[key: string]: any} | null> => {

      return control.value != this.name ? this.ps.doesProjectExists( control.value )
        .then( r => r ? { exists: true } : null ) : Promise.resolve(null);
    };
  }

  get authenticated() { return this.ps.profile.authenticated; }

  constructor(private builder: FormBuilder, private dialog: MatDialog, private popup: PopupService, ps: ProjectService) { 

    super(ps, '');

    this.form = this.builder.group({
      'name' : ['', [ Validators.required, Validators.minLength(3) ], this.projectNameValidator ],
      'pitch': ['', Validators.required ],
      'web'  : ['']
    });
  }

  ngOnDestroy() { this.release(); }

  @Input() msgs: any = {};

  @Input() set project(project: wmProject) { 

    this.wrap(project); 
  }

  @Output() open = new EventEmitter<string>();

  @Output() redirect = new EventEmitter<string>();

  public edit({ clientX, clientY }: MouseEvent) {

    this.form.setValue({ 
      name: this.name,
      pitch: this.pitch,
      web: this.web
    });

    this.refDialog = this.dialog.open(this.tmplDialog, { 
      minWidth: '300px',
      position: { right: `${window.innerWidth - clientX}px`, top: `${clientY}px` } 
    });
  }

  public changeLogo(url: string) {

    // Updates the local data first
    this.data.logo = url;
    // Updates the database next
    this.update({ logo: url || '' } as wmProject);
  }

  // Ask for confirmation prior to delete the project
  public deleteProject() {
    this.popup.confirmPopup(this.msgs.canDelete)
      .subscribe( () => this.delete() );
  }

  public save() {

    if(!this.refDialog) { return; }

    const { name, pitch, web } = this.form.value;

    this.update({ name, pitch, web } as wmProject)
      .then( () => this.refDialog.close() );
  }
/*
  public modifiedOn(project: Project): string {
    const timestamp = project.data.updated || project.data.created;
    return moment(timestamp ? timestamp.toMillis() : undefined).format('lll');
  }
*/
}
