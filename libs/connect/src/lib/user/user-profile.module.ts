import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule  } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { UploaderModule } from '../uploader/uploader.module';
import { UserProfile } from './user-profile.service';

@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    DatabaseModule,
    UploaderModule
  ],
  providers: [ UserProfile ]
})
export class UserProfileModule { }