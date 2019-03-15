import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MarkdownModule } from '@wizdm/markdown';
import { ContentResolver, PageGuardService } from '../../utils';
import { TermsPrivacyComponent } from './terms-privacy.component';

const routes: Routes = [
  {
    path: '',
    component: TermsPrivacyComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['terms'] },
    canDeactivate: [ PageGuardService ]
  }
];

@NgModule({
  declarations: [ TermsPrivacyComponent ],
  imports: [
    CommonModule,
    //FlexLayoutModule,
    MarkdownModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class TermsPrivacyModule { }
