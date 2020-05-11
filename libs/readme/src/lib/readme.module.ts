import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiTextModule } from '@wizdm/emoji/text';
import { ReadmeComponent } from './readme.component';

@NgModule({
  imports: [ 
    CommonModule, 
    EmojiTextModule 
  ],
  declarations: [ ReadmeComponent ],
  exports: [ ReadmeComponent ]
})
export class ReadmeModule { }