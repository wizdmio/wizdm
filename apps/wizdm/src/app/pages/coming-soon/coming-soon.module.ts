import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContentResolver } from '../../core';
import { ComingSoonComponent } from './coming-soon.component';

const routes: Routes = [
  {
    path: '',
    component: ComingSoonComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['comingSoon'] }
  }
];

@NgModule({
  declarations: [ ComingSoonComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class ComingSoonModule { }
