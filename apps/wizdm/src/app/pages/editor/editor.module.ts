import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// Angular material + Flex layout
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatTooltipModule,
  MatDividerModule
} from '@angular/material';
import { PopupModule } from '@wizdm/elements';
import { EditableModule } from '@wizdm/editable';
import { ContentResolver } from '../../utils';
import { EditorComponent } from './editor.component';
import { ContextMenuComponent } from './menu/context-menu.component';
import { ToolboxComponent } from './toolbox/toolbox.component';

const routes: Routes = [
  {
    path: '',
    component: EditorComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['editor', 'info'] },
    canActivate: [ ContentResolver ],
    canDeactivate: [ ContentResolver ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    PopupModule,
    EditableModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ 
    EditorComponent, 
    ContextMenuComponent,
    ToolboxComponent 
  ]
})
export class EditorModule { }
