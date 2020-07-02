import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { EditableModule } from '@wizdm/editable';
import { ReadmeModule } from '@wizdm/readme';
import { CanLeaveModule, CanLeaveGuard } from 'app/utils/can-leave';
import { AuthGuard, loggedIn } from 'app/utils/auth-guard';
import { EditorComponent } from './editor.component';
import { ToolboxComponent } from './toolbox/toolbox.component';
import { ContextMenuComponent } from './menu/context-menu.component';
import { LongpressComponent } from './longpress/longpress.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'editor',
    component: EditorComponent,
    canActivate: [ AuthGuard ], data: { authGuardPipe: loggedIn },
    canDeactivate: [ CanLeaveGuard ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatSidenavModule,
    EditableModule,
    ReadmeModule,
    CanLeaveModule,
    ContentRouterModule.forChild(routes)
  ],
  declarations: [ 
    EditorComponent, 
    ToolboxComponent,
    ContextMenuComponent,
    LongpressComponent
  ]
})
export class EditorModule { }
