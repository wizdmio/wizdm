import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageResolver } from '@wizdm/content';
//-------
import { ElementsModule } from '../elements/elements.module';
import { NavComponent } from './navigator.component';
import { LogoComponent } from './logo/logo.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ActionComponent } from './toolbar/action/action.component';
import { MenuComponent } from './menu/menu.component';
import { ErrorsComponent } from './errors/errors.component';
import { FooterComponent } from './footer/footer.component';
import { FitViewportDirective } from './viewport/fit-viewport.directive';
import { ConsentComponent } from './consent/consent.component';
import { UserLanguageResolver } from './utils/language-resolver.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ElementsModule
  ],
  declarations: [
    NavComponent,
    LogoComponent,
    NavbarComponent,
    ToolbarComponent,
    ActionComponent,
    MenuComponent,
    FooterComponent,
    FitViewportDirective,
    ConsentComponent,
    ErrorsComponent,
  ],
  providers: [
    // Provide a LanguageResolver based on user language preferences
    { provide: LanguageResolver, useClass: UserLanguageResolver }
  ]
})
export class NavigatorModule { }
