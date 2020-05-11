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
import { PrismTsModule } from '@wizdm/prism/languages';
import { PrismScssModule } from '@wizdm/prism/languages';
import { PrismMdModule } from '@wizdm/prism/languages';
import { SidenavModule } from 'app/navigator/sidenav';
import { SizeLockModule } from 'app/utils/size-lock';
import { TeleportModule } from '@wizdm/teleport';
import { StaticResolver } from './static-resolver.service';
import { StaticComponent } from './static.component';
import { TocModule } from './toc';

/** Static content route matcher */
export function staticMatcher(url: UrlSegment[]): UrlMatchResult {

  // Builds teh posParams from the url sub segments
  const posParams = url.reduce( (params, url, index) => {

    params[`path${index}`] = url;
    return params;

  }, {});

  // Matches all the routes passing along the sub segments as pos parameters
  return { consumed: url, posParams };
}

const routes: RoutesWithContent = [{
  //path: '',
  matcher: staticMatcher,
  //content: 'static',
  component: StaticComponent,
  data: { source: 'assets/docs' },
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
    PrismTsModule,
    PrismScssModule,
    PrismMdModule,
    GtagModule,
    AnimateModule,
    SidenavModule,
    SizeLockModule,
    TeleportModule,
    TocModule,
    ContentRouterModule.forChild(routes)
  ],
  // Provides the @content/FileLoder locally to avoid mixing up Dynamic content and Static content within the same cache
  providers: [ FileLoader, StaticResolver ]
})
export class StaticModule { }
