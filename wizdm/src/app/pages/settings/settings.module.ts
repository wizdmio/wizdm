import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { IconModule } from '@wizdm/elements/icon';
import { NavInkbarModule } from '@wizdm/elements/inkbar';
import { SidenavModule } from 'app/navigator/sidenav';
import { ScrollingModule } from 'app/utils/scrolling';
import { AuthGuard, loggedIn } from 'app/utils/auth-guard';
import { SettingsComponent } from './settings.component';

const routes: RoutesWithContent = [{
  
  path: '',
  content: 'settings',
  component: SettingsComponent,
  canActivate: [ AuthGuard ], data: { authGuardPipe: loggedIn },
  children: [

    { path: '', redirectTo: 'profile', pathMatch: 'full' },
    { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
    { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
    { path: 'uploads', loadChildren: () => import('./uploads/uploads.module').then(m => m.UploadsModule) }
  ]
}];

@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDividerModule,
    MatButtonModule,
    MatListModule,
    IconModule, 
    NavInkbarModule,
    ScrollingModule,
    SidenavModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class SettingsModule { }
