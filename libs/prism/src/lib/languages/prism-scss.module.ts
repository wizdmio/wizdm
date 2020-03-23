import { NgModule } from '@angular/core';
import { PrismModule } from '../prism.module';
import 'prismjs/components/prism-scss';

@NgModule({ imports: [ PrismModule ] })
export class PrismScssModule { }