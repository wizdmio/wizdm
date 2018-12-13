import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentManager } from './content-manager.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  providers: [ 
    ContentManager
  ]
})
export class ContentModule { }
