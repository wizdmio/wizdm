import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
//import {  } from '@angular/material';
//import {  } from '@wizdm/elements';
import { ContentResolver, PageGuardService } from '../../utils';
import { NotFoundComponent } from './not-found.component';

const routes: Routes = [
  {
    path: '',
    component: NotFoundComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['notFound'] }
  }
];

@NgModule({
  declarations: [ NotFoundComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class NotFoundModule { }
