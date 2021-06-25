import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PipesModule } from '@wizdm/connect/database/pipes';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { EditableViewerModule } from '@wizdm/editable';
import { ContentModule } from '@wizdm/content';
import { AvatarModule } from '@wizdm/elements/avatar';
import { IconModule } from '@wizdm/elements/icon';
import { LazyDialogModule } from '@wizdm/lazy-dialog';
import { DialogModule } from '@wizdm/elements/dialog';
import { ReadmeModule } from '@wizdm/readme';
import { CardComponent } from './card.component';

@NgModule({
  imports: [ 
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatMenuModule,
    EditableViewerModule,
    MomentPipesModule,
    PipesModule,
    ContentModule,
    AvatarModule,
    IconModule,
    DialogModule,
    ReadmeModule,
    LazyDialogModule
  ],
  declarations: [ CardComponent ],
  exports: [ CardComponent ]
})
export class CardModule { }
