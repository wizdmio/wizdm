import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
//import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MarkdownModule } from '@wizdm/markdown';

// Includes a subset of languages to support syntax highlighting. Checkout Prism.js to add more
/*
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-typescript';
*/

import { AnimateModule } from '../../elements/animate';
//import { ContentResolver } from '../../core';
import { StaticComponent } from './static.component';

const routes: Routes = [
  {
    path: '',
    component: StaticComponent,
    //resolve: { content: ContentResolver }, 
    //data: { i18n: ['static'] },
    //canActivate: [ ContentResolver ],
    //canDeactivate: [ ContentResolver ]
  }
];

@NgModule({
  declarations: [ StaticComponent ],
  imports: [
    CommonModule,
    //FlexLayoutModule,
    MatDividerModule,
    MarkdownModule.init({ commonmark: true, footnotes: true }),
    AnimateModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class StaticModule { }
