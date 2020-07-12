import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { InterpolationPipesModule } from '@wizdm/pipes/interpolation';
import { ContentConfig, ContentConfigToken } from './loader/content-configurator.service';
import { ContentConfigurator } from './loader/content-configurator.service';
import { ContentLoader, FileLoader } from './loader/content-loader.service';
import { SelectorResolver } from './router/selector-resolver.service';
import { ContentDirective } from './streamer/content.directive';

@NgModule({
  declarations: [ ContentDirective ],
  imports: [ HttpClientModule, InterpolationPipesModule ],
  exports: [ ContentDirective, InterpolationPipesModule ]
})
export class ContentModule { 
  /** Initializes the content module with loaders. Call this once in the app root module */
  static init(config: ContentConfig): ModuleWithProviders<ContentModule> {
    return {
      ngModule: ContentModule,
      providers: [
        // Configuration token used internally
        { provide: ContentConfigToken, useValue: config }, 
        // Content configurator providing default values when missing 
        ContentConfigurator,
        // Standard content loader provided only at root level
        { provide: ContentLoader, useExisting: FileLoader }, 
        // Default content loader provided as the standard when not overriden
        FileLoader,
        // Standard selector resolver provided only at root level
        SelectorResolver
      ]
    }
  }
}