import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MarkdownModule } from '@wizdm/markdown';
import { ContentResolver } from '../../core';
import { StaticComponent } from './static.component';

const routes: Routes = [
  {
    path: '',
    component: StaticComponent,
    //resolve: { content: ContentResolver }, 
    //data: { modules: ['static'] },
    //canActivate: [ ContentResolver ],
    //canDeactivate: [ ContentResolver ]
  }
];

@NgModule({
  declarations: [ StaticComponent ],
  imports: [
    CommonModule,
    //FlexLayoutModule,
    MarkdownModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class StaticModule { }
