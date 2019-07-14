import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirebaseHandler } from './handler.component';

const routes: Routes = [
  {
    path: '',
    component: FirebaseHandler
  }
];

@NgModule({
  declarations: [ FirebaseHandler ],
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class HandlerModule { }