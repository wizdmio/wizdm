import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';
import { IconModule } from '@wizdm/elements';
import { ContentResolver, PageGuardService } from '../../utils';
import { AboutComponent } from './about.component';

const routes: Routes = [
  {
    path: '',
    component: AboutComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['about'] }
  }
];

@NgModule({
  declarations: [ AboutComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    //MatButtonModule,
    //IconModule, 
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class AboutModule { }
