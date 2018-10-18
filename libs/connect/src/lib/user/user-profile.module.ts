import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule  } from '../auth/auth.module';
import { UserProfile } from './user-profile.service';

@NgModule({
  imports: [
    CommonModule,
    AuthModule
  ],
  providers: [ UserProfile ]
})
export class UserProfileModule { }