import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IconModule } from '../../elements/icon';
import { ContentResolver } from '../../core';
import { RedirectComponent } from './redirect.component';

const routes: Routes = [
  {
    path: '',
    component: RedirectComponent,
    resolve: { content: ContentResolver }, 
    data: { i18n: ['redirect'] },
    //canActivate: [ ContentResolver ],
    //canDeactivate: [ ContentResolver ]
  }
];

@NgModule({
  declarations: [ RedirectComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatProgressBarModule,
    IconModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class RedirectModule { }
