import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EditableModule } from '@wizdm/editable';
import { PopupModule } from '../../elements/popup';
import { ContentResolver } from '../../core';
import { EditorComponent } from './editor.component';
import { ContextMenuComponent } from './menu/context-menu.component';
import { ToolboxComponent } from './toolbox/toolbox.component';

const routes: Routes = [
  {
    path: '',
    component: EditorComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['editor'] },
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
    MatSidenavModule,
    EditableModule,
    PopupModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ 
    EditorComponent, 
    ContextMenuComponent,
    ToolboxComponent
  ]
})
export class EditorModule { }
