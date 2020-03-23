import { NgModule } from '@angular/core';
import { PrismModule } from '../prism.module';
import 'prismjs/components/prism-typescript';

@NgModule({ imports: [ PrismModule ] })
export class PrismTsModule { }