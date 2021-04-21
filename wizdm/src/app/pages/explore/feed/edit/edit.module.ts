import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
//import { MatBadgeModule } from '@angular/material/badge';
//import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from '@angular/material/divider';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { EditableDocumentModule } from '@wizdm/editable/document';
import { AvatarModule } from '@wizdm/elements/avatar';
import { IconModule } from '@wizdm/elements/icon';
import { ToolbarModule } from './toolbar/toolbar.module';
import { LongPressModule } from './longpress/longpress.module';
import { EditComponent } from './edit.component';

/** Dialog route. This route will be used by the DialogLoader, emulating the router, to lazily load the dialog */
const routes: RoutesWithContent = [{
  path: '',
  content: 'explorer-feed-edit',
  component: EditComponent,
  data: { dialogConfig: {  width: '500px', maxWidth: '100%' }}
}];

@NgModule({
  
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    EditableDocumentModule,
    AvatarModule,
    IconModule,
    ToolbarModule,
    LongPressModule,
    ContentRouterModule.forChild(routes)
  ],
  declarations: [ EditComponent ]
})
export class EditModule { }
