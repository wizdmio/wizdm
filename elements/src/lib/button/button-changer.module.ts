import { NgModule } from '@angular/core';
import { ButtonTypeChanger } from './button-changer.directive';
import { ButtonMediaChanger } from './button-media-changer.directive';

@NgModule({
  imports: [],
  declarations: [ ButtonTypeChanger, ButtonMediaChanger ],
  exports: [ ButtonTypeChanger, ButtonMediaChanger ]
})
export class ButtonChangerModule { }