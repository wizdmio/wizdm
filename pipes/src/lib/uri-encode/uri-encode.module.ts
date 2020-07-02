import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { UriEncodePipe } from './uri-encode.pipe';

@NgModule({
  imports: [ HttpClientModule ],
  declarations: [ UriEncodePipe ],
  exports: [ UriEncodePipe ]
})
export class UriEncodePipeModule { }
