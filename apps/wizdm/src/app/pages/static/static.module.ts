import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDividerModule } from '@angular/material/divider';
import { UrlSegment, UrlMatchResult } from '@angular/router';
import { ContentRouterModule, RoutesWithContent, FileLoader } from '@wizdm/content';
import { ActionLinkModule } from '@wizdm/actionlink';
import { GtagModule } from '@wizdm/gtag';
import { AnimateModule } from '@wizdm/animate';
import { MarkdownModule } from '@wizdm/markdown';
import { SidenavModule } from 'app/navigator/sidenav';
import { SizeLockModule } from 'app/utils/size-lock';
import { StaticResolver } from './static-resolver.service';
import { StaticComponent } from './static.component';
import { TocModule } from './toc';

// Imports the extra languages for prismjs used by MarkdownModule
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markdown';

/** Static content route matcher */
export function matchFullPath(url: UrlSegment[]): UrlMatchResult {

  // Builds the posParams from the url sub segments
  const posParams = url.reduce( (params, url, index) => {

    params[`path${index}`] = url;
    return params;

  }, {});

  // Matches all the routes passing along the sub segments as pos parameters
  return { consumed: url, posParams };
}

const routes: RoutesWithContent = [{
  path: '',
  //matcher: matchFullPath,
  //content: 'static',
  component: StaticComponent,
  data: { source: 'assets/static' },
  resolve: { document: StaticResolver }
}];

@NgModule({
  declarations: [ StaticComponent ],
  imports: [
    CommonModule,
    ScrollingModule,
    MatDividerModule,
    MarkdownModule.init({ commonmark: true, footnotes: true }),
    ActionLinkModule,
    GtagModule,
    AnimateModule,
    SidenavModule,
    SizeLockModule,
    TocModule,
    ContentRouterModule.forChild(routes)
  ],
  // Provides the @content/FileLoder locally to avoid mixing up Dynamic content and Static content within the same cache
  providers: [ FileLoader, StaticResolver ]
})
export class StaticModule { }
