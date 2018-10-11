import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageResolver } from '@wizdm/content';
import { AuthModule  } from '../auth/auth.module';
import { UserProfile } from './user-profile.service';

@NgModule({
  imports: [
    CommonModule,
    AuthModule
  ],
  providers: [ UserProfile ]
})
export class UserProfileModule { 
  /** 
   * Instruct the DI to provide UserProfile as LanguageResolver 
   */
  static resolveUserLanguage(): ModuleWithProviders<UserProfileModule> {
    return {
      ngModule: UserProfileModule,
      providers: [ 
        { provide: LanguageResolver, useClass: UserProfile }
      ]
    }
  }
}