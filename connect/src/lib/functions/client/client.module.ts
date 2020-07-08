import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FunctionsModule } from '../functions.module';
import { AuthModule } from '../../auth/auth.module';
import { FunctionsClient } from './client.service';
import { AuthToken } from './auth-token.service';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [ AuthModule, FunctionsModule, HttpClientModule ],
  providers: [
    // Installs an HttpCLient interceptor to include the auth token along with the client requests
    { provide: HTTP_INTERCEPTORS, useClass: AuthToken, multi: true },
    // Provides the client service
    FunctionsClient
  ]
})
export class ClientModule { }