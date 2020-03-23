import { NgModule } from '@angular/core';
import { PrismModule } from '../prism.module';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

@NgModule({ imports: [ PrismModule ] })
export class PrismCppModule { }