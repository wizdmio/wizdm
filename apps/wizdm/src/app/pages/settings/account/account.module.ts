import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { GtagModule } from '@wizdm/gtag';
import { ReadmeModule } from '@wizdm/readme';
import { RedirectModule } from '@wizdm/redirect';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
//import { CanLeaveModule, CanLeaveGuard } from 'app/pages/guards/can-leave';
import { AccountComponent } from './account.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'account',
    component: AccountComponent,
    //canDeactivate: [ CanLeaveGuard ]
  }
];


@NgModule({
  declarations: [ AccountComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDividerModule,
    MatButtonModule,
    GtagModule,
    ReadmeModule,
    RedirectModule,
    //CanLeaveModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class AccountModule { }
