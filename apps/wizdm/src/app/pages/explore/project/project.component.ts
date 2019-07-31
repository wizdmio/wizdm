import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project, wmProject  } from '../../../core';
import moment from 'moment';

@Component({
  selector: 'wm-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  host: { 'class': 'mat-elevation-z1' }
})
export class ProjectComponent {

  @ViewChild('formTemplate', { static: true }) 
  private tmplDialog: TemplateRef<ProjectComponent>;
  private refDialog: MatDialogRef<ProjectComponent>;

  readonly form: FormGroup;

  constructor(private builder: FormBuilder, private dialog: MatDialog) { 

    this.form = this.builder.group({
      'name': ['', [ Validators.required, Validators.minLength(3) ] ],
      'pitch': ['', Validators.required ]
    });
  }

  public favorite = false;

  @Input() msgs: any = {};

  @Input() project: Project;

  @Output() open = new EventEmitter<string>();

  public edit({ clientX, clientY }: MouseEvent) {

    this.form.setValue({ 
      name: this.project.data.name,
      pitch: this.project.data.pitch 
    });

    this.refDialog = this.dialog.open(this.tmplDialog, { 
      minWidth: '300px',
      position: { right: `${window.innerWidth - clientX}px`, top: `${clientY}px` } 
    });
  }

  public changeLogo(url: string) {

    //this.project.data.logo = url;
  }

  public save() {

    if(!this.refDialog) { return; }

    //this.saveChange.emit(this.form.value);
    this.refDialog.close();
  }

  public modifiedOn(project: Project): string {
    const timestamp = project.data.updated || project.data.created;
    return moment(timestamp ? timestamp.toMillis() : undefined).format('lll');
  }

  public toggleFavorite(): void {
    this.favorite != this.favorite;
  }

}
