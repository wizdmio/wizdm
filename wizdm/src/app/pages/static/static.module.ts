import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContentRouterModule, RoutesWithContent, FileLoader } from '@wizdm/content';
import { GtagModule } from '@wizdm/gtag';
import { AnimateModule } from '@wizdm/animate';
import { MarkdownModule } from '@wizdm/markdown';
import { IconModule } from '@wizdm/elements/icon';
import { FabModule } from 'app/navigator/fab';
import { SidenavModule } from 'app/navigator/sidenav';
import { ActionbarModule } from 'app/navigator/actionbar';
import { ScrollingModule } from 'app/utils/scrolling';
import { SizeLockModule } from 'app/utils/size-lock';
import { StaticResolver } from './static-resolver.service';
import { StaticComponent } from './static.component';
import { TocModule } from './toc';

// Imports the extra languages for prismjs used by MarkdownModule
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markdown';



const routes: RoutesWithContent = [{
  path: '',
  content: 'static',
  component: StaticComponent,
  data: { source: 'assets/doc' },
  resolve: { document: StaticResolver }
}];

@NgModule({
  declarations: [ StaticComponent ],
  imports: [
    CommonModule,
    MatDividerModule,
    MatButtonModule,
    MatTooltipModule,
    MarkdownModule.init({ commonmark: true, footnotes: true }),
    GtagModule,
    AnimateModule,
    IconModule,
    FabModule,
    SidenavModule,
    ActionbarModule,
    ScrollingModule,
    SizeLockModule,
    TocModule,
    ContentRouterModule.forChild(routes)
  ],
  // Provides the @content/FileLoder locally to avoid mixing up Dynamic content and Static content within the same cache
  providers: [ FileLoader, StaticResolver ]
})
export class StaticModule { }
