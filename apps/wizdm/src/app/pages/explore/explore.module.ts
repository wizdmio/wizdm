import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { GtagModule } from '@wizdm/gtag';
//import { AnimateModule } from '@wizdm/animate';
import { RedirectModule } from '@wizdm/redirect';
import { ReadmeModule } from '@wizdm/readme';
import { IconModule } from '@wizdm/elements/icon';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { AuthGuardModule } from 'app/auth/auth-guard';
import { ActionbarModule } from 'app/navigator/actionbar';
import { ExploreComponent } from './explore.component';
import { PublicComponent } from './public/public.component';
import { PostComponent } from './post/post.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'explore',
    component: ExploreComponent,
    children: [
      { path: '', redirectTo: 'public', pathMatch: 'full' },
      { path: 'public', component: PublicComponent }
    ]
  }
];

@NgModule({
  declarations: [ 
    ExploreComponent,
    PublicComponent,
    PostComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatMenuModule,
    GtagModule,
    //AnimateModule,
    RedirectModule,
    ReadmeModule,
    IconModule,
    ButtonChangerModule,
    AuthGuardModule,
    ActionbarModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ExploreModule { }
