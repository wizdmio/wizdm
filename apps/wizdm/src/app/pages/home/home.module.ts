import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
//import { NavigatorModule } from '../../navigator/navigator.module';
import { IconModule } from '../../elements/icon';
import { DisclaimerModule } from '../../elements/disclaimer';
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
    IconModule, 
    DisclaimerModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class HomeModule { }
