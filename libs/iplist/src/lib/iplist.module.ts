import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IpList } from './iplist.service';

@NgModule({
  imports: [ HttpClientModule ],
  providers: [ IpList ]
})
export class IpListModule { }
