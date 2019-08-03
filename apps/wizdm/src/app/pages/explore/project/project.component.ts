import { Component, OnDestroy, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private builder: FormBuilder, private dialog: MatDialog, ps: ProjectService) { 
    super(ps, '');

    this.form = this.builder.group({
      'name': ['', [ Validators.required, Validators.minLength(3) ] ],
      'pitch': ['', Validators.required ]
    });
  }

  ngOnDestroy() { this.release(); }

  @Input() msgs: any = {};

  @Input() set project(project: wmProject) { 

    this.wrap(project); 
  }

  @Output() open = new EventEmitter<string>();
  

  public edit({ clientX, clientY }: MouseEvent) {

    this.form.setValue({ 
      name: this.name,
      pitch: this.pitch 
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
/*
  public modifiedOn(project: Project): string {
    const timestamp = project.data.updated || project.data.created;
    return moment(timestamp ? timestamp.toMillis() : undefined).format('lll');
  }
*//*
  public toggleFavorite(): void {
    this.favorite != this.favorite;
  }*/

  

}
