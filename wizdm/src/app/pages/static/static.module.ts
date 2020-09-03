import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { GtagModule } from '@wizdm/gtag';
import { AnimateModule } from '@wizdm/animate';
import { MarkdownModule } from '@wizdm/markdown';
import { PrismModule } from '@wizdm/prism';
import { IconModule } from '@wizdm/elements/icon';
import { FabModule } from 'app/navigator/fab';
import { SidenavModule } from 'app/navigator/sidenav';
import { ActionbarModule } from 'app/navigator/actionbar';
import { ScrollingModule } from 'app/utils/scrolling';
import { SizeLockModule } from 'app/utils/size-lock';
import { StaticResolver } from './static-resolver.service';
import { StaticComponent } from './static.component';
import { TocModule } from './toc';

// Environment
import { environment } from 'env/environment';
const  { markdown, prism } = environment;

const routes: RoutesWithContent = [{
  path: '',
  content: 'static',
  component: StaticComponent,
  data: { source: 'assets/doc' },
  resolve: { document: StaticResolver }
}];

@NgModule({
  declarations: [ StaticComponent ],
  providers: [ StaticResolver ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatDividerModule,
    MatButtonModule,
    MatTooltipModule,
    GtagModule,
    AnimateModule,
    IconModule,
    FabModule,
    SidenavModule,
    ActionbarModule,
    ScrollingModule,
    SizeLockModule,
    TocModule,
    MarkdownModule.init(markdown),
    PrismModule.init(prism),
    ContentRouterModule.forChild(routes)
  ]
})
export class StaticModule { }
