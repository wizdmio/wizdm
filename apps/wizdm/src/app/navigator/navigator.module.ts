import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageResolver } from '@wizdm/content';
//-------
import { ElementsModule } from '../elements/elements.module';
import { NavComponent } from './navigator.component';
import { UserLanguageResolver } from './resolver/language-resolver.service';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ActionComponent as ToolbarAction } from './toolbar/action/action.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { ScrollViewDirective } from './scroll-view/scroll-view.directive';
import { ConsentComponent } from './consent/consent.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ElementsModule
  ],
  declarations: [
    NavComponent,
    ToolbarComponent,
    ToolbarAction,
    MenuComponent,
    FooterComponent,
    ScrollViewDirective,
    ConsentComponent
  ],
  providers: [
    // Provide a LanguageResolver based on user language preferences
    { provide: LanguageResolver, useClass: UserLanguageResolver }
  ]
})
export class NavigatorModule { }
