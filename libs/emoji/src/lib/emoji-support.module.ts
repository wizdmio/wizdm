import { EmojiUtils, EmojiConfig, EmojiConfigToken } from './utils/emoji-utils.service';
import { NgModule, ModuleWithProviders } from '@angular/core';

@NgModule({
  imports: [ ],
  providers: [ EmojiUtils ]
})
export class EmojiSupportModule { 

   static init(config: EmojiConfig): ModuleWithProviders<EmojiSupportModule> {
    return {
      ngModule: EmojiSupportModule,
      providers: [
        { provide: EmojiConfigToken, useValue: config }
      ]
    };
  } 
}