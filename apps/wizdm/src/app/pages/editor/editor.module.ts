import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// Angular material + Flex layout
import { FlexLayoutModule } from '@angular/flex-layout';
//import { } from '@angular/material';
//import { } from '@wizdm/elements';
import { DocumentModule } from '../../document/editable-document.module';
import { ContentResolver, 
         AuthGuardService, 
         PageGuardService } from '../../utils';
import { EditorComponent } from './editor.component';

const routes: Routes = [
  {
    path: '',
    component: EditorComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['editor', 'info'] },
    canActivate: [ AuthGuardService ],
    canDeactivate: [ PageGuardService ],
  }
];

@NgModule({

  declarations: [ EditorComponent ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    DocumentModule,
    RouterModule.forChild(routes)
  ]
})
export class EditorModule { }
