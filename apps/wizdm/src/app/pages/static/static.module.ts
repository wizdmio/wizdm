import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
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
import { StaticResolver } from './static-resolver.service';
import { StaticComponent } from './static.component';

const routes: RoutesWithContent = [
  {
    path: '',
    component: StaticComponent,
    resolve: { document: StaticResolver }
    //canActivate: [ AuthGuard ],
    //canDeactivate: [ PageGuard ]
  }
];

@NgModule({
  declarations: [ StaticComponent ],
  imports: [
    CommonModule,
    MatDividerModule,
    MarkdownModule.init({ commonmark: true, footnotes: true }),
    AnimateModule,
    ContentRouterModule.forChild(routes)
  ],
  providers: [ StaticResolver ]
})
export class StaticModule { }
