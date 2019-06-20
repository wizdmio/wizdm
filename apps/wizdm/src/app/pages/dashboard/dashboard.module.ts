import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContentResolver } from '../../core';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['dashboard'] },
    canActivate: [ ContentResolver ],
    canDeactivate: [ ContentResolver ],
  }
];

@NgModule({
  declarations: [ DashboardComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class DashboardModule { }
