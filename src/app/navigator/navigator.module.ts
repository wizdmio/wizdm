import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//-------
import { SharedModule } from 'app/shared/shared.module';
import { NavComponent } from './navigator.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LogoComponent } from './toolbar/logo/logo.component';
import { TogglerComponent } from './toolbar/toggler/toggler.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    NavComponent,
    ToolbarComponent,
    LogoComponent,
    TogglerComponent,
    FooterComponent
  ],
  providers: [
  ]
})
export class NavigatorModule { }
