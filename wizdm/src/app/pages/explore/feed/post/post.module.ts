import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout'
import { PostComponent } from './post.component';
import { PostCardModule } from '../post-card/post-card.module';

@NgModule({
  imports: [ 
    CommonModule,
    FlexLayoutModule,
    PostCardModule
  ],
  declarations: [ PostComponent ],
  exports: [ PostComponent ]
})
export class PostModule { }
