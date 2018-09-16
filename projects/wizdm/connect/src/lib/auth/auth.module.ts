import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule
  ],
  providers: [ AuthService ]
})
export class AuthModule { }
