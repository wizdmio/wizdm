import { NgModule } from '@angular/core';
import { TextareaNewline } from './textarea-newline';
import { TypeinAdapter } from './typein-adapter';

@NgModule({
  imports: [ ],
  declarations: [ TextareaNewline, TypeinAdapter ],
  exports: [ TextareaNewline, TypeinAdapter ]
})
export class TextareaModule { }
