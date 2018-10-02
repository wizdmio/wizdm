import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UnsplashService, UNSPLASH_CONFIG, UnsplashConfig } from './unsplash.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class UnsplashModule { 
  static forRoot(config: UnsplashConfig): ModuleWithProviders<UnsplashModule> {
    return {
      ngModule: UnsplashModule,
      providers: [
        UnsplashService,
        { provide: UNSPLASH_CONFIG, useValue: config },
      ]
    };
  }
}
