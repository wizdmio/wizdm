import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { ClientModule } from '@wizdm/connect/functions/client';
import { AuthGuard, authorized } from 'app/utils/auth-guard';
import { AdminComponent } from './admin.component';
import { rootEmail } from 'env/secrets';

const routes: RoutesWithContent = [{

  path: '',
  content: 'admin',
  component: AdminComponent,
  canActivate: [ AuthGuard ], data: { authGuardPipe: authorized(['admin'], rootEmail) },
  children: [

    { path: '', redirectTo: 'access', pathMatch: 'full' },
    { path: 'access', loadChildren: () => import('./user-access/user-access.module').then(m => m.UserAccessModule) },
    { path: 'fixer', loadChildren: () => import('./profile-fixer/profile-fixer.module').then(m => m.ProfileFixerModule) }
  ]
}];

@NgModule({

  imports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    ClientModule,
    ContentRouterModule.forChild(routes)
  ],

  declarations: [ AdminComponent ]
})
export class AdminModule { }