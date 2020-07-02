import { NgModule, Optional, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminService, ADMIN_END_POINT } from './admin.service';
import { AuthService } from '@wizdm/connect/auth';
import { AuthToken } from './auth-token.service';

@NgModule({
  imports: [ HttpClientModule ],

  providers: [
    // Installs an HttpCLient interceptor to include the auth token along with the wizdm API requests
    { provide: HTTP_INTERCEPTORS, useClass: AuthToken, multi: true },
    // Provides the Admin API call service
    AdminService
  ]
})
export class AdminModule {

  constructor(@Optional() auth: AuthService) {

    // Makes sure the AuthModule is up and running
    if(!auth) { throw new Error('Admin module requires authentication from @wizdm/connect up and running'); }
  }

  /** Initializes the Admin module providing the API endpoint to call to */
  static init(endPoint: string): ModuleWithProviders<AdminModule> {

    return {
      ngModule: AdminModule,
      providers: [ { provide: ADMIN_END_POINT, useValue: endPoint } ]
    }
  }
}
