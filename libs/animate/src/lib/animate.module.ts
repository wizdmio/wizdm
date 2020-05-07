import { NgModule, ModuleWithProviders } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AnimateComponent } from './animate.component';
import { AnimateDirective } from './animate.directive';
import { AnimateConfig, ANIMATE_CONFIG } from './animate.config'

@NgModule({
  imports: [ ScrollingModule ],
  declarations: [ AnimateComponent, AnimateDirective ],
  exports: [ AnimateComponent, AnimateDirective ]
})
export class AnimateModule { 

  static init(config: AnimateConfig): ModuleWithProviders<AnimateModule> {

    return {
      ngModule: AnimateModule,
      providers: [
        { provide: ANIMATE_CONFIG, useValue: config }
      ]
    };
  }
};
