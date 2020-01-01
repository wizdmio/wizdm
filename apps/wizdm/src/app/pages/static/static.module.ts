import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { AnimateModule } from '@wizdm/animate';
import { MarkdownModule } from '@wizdm/markdown';
import './prism-languages';
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
    HttpClientModule,
    MatDividerModule,
    MarkdownModule.init({ commonmark: true, footnotes: true }),
    AnimateModule,
    ContentRouterModule.forChild(routes)
  ],
  providers: [ StaticResolver ]
})
export class StaticModule { }
