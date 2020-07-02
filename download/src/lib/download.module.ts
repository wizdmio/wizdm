import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DownloadDirective } from './download.directive';

@NgModule({
  imports: [ HttpClientModule ],
  declarations: [ DownloadDirective ],
  exports: [ DownloadDirective ]
})
export class DownloadModule { }
