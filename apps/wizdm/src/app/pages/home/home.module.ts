import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';
import { DisclaimerModule } from '@wizdm/elements';
import { ContentResolver } from '../../core';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['home'] },
    //canActivate: [ ContentResolver ],
    canDeactivate: [ ContentResolver ]
  }
];

@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    DisclaimerModule, 
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class HomeModule { }
