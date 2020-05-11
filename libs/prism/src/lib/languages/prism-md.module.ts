import { NgModule } from '@angular/core';
import { PrismModule } from '../prism.module';
import 'prismjs/components/prism-markdown';

@NgModule({ imports: [ PrismModule ] })
export class PrismMdModule { }