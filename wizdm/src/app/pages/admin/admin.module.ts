import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { ClientModule } from '@wizdm/connect/functions/client';
import { AdminComponent } from './admin.component';
import { AuthGuard } from 'app/utils/auth-guard';
import { isAdmin } from 'app/utils/admin';

const routes: RoutesWithContent = [{

  path: '',
  content: 'admin',
  component: AdminComponent,
  canActivate: [ AuthGuard ], data: { authGuardPipe: isAdmin },
  children: [

    { path: '', redirectTo: 'access', pathMatch: 'full' },
    { path: 'access', loadChildren: () => import('./user-access/user-access.module').then(m => m.UserAccessModule) },
    { path: 'fixer', loadChildren: () => import('./profile-fixer/profile-fixer.module').then(m => m.ProfileFixerModule) }
  ]
}];

@NgModule({

  imports: [
    CommonModule,
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