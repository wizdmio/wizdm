import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDividerModule } from '@angular/material/divider';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { GtagModule } from '@wizdm/gtag';
import { AnimateModule } from '@wizdm/animate';
import { MarkdownModule } from '@wizdm/markdown';
import { PrismTsModule } from '@wizdm/prism/languages';
import { PrismScssModule } from '@wizdm/prism/languages';
import { SidenavModule } from 'app/navigator/sidenav';
import { ScrollModule } from 'app/utils/scrolling';
import { SizeLockModule } from 'app/utils/size-lock';
import { TeleportModule } from '@wizdm/teleport';
import { StaticResolver } from './static-resolver.service';
import { StaticComponent } from './static.component';
import { TocModule } from './toc';

const routes: RoutesWithContent = [
  {
    path: '',
    //content: 'static',
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
    ScrollingModule,
    MatDividerModule,
    MarkdownModule.init({ commonmark: true, footnotes: true }),
    PrismTsModule,
    PrismScssModule,
    GtagModule,
    AnimateModule,
    ScrollModule,
    SidenavModule,
    SizeLockModule,
    TeleportModule,
    TocModule,
    ContentRouterModule.forChild(routes)
  ],
  providers: [ StaticResolver ]
})
export class StaticModule { }
