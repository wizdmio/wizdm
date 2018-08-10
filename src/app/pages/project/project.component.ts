import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ContentService, AuthService, ProjectService, wmProject } from 'app/core';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

const $debug = "# Test with a [link](../../profile)\nFollowed by a simple paragraph _with_ **emphasis** and ~~corrections~~ and a note[^note]\n\n [^note]: this is a note"

@Component({
  selector: 'wm-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  public snapshot: wmProject;

  constructor(private content : ContentService,
              private project : ProjectService,
              private route   : ActivatedRoute) { }

  ngOnInit() {

    //this.snapshot = { document: $debug } as wmProject;

      this.route.paramMap.pipe(
        switchMap( param => {

          let projectId = param.get('id');
  
          return this.project.queryProject(projectId);
  
        }),
        catchError( error => { 
          
          return of({ document: $debug } as wmProject); 
        
        })
      
      ).subscribe( data => { 
        
        this.snapshot = data || { document: $debug } as wmProject;
      
      } );
  }

}
