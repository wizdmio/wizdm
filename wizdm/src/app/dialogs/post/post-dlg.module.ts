import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostDialogComponent } from './post-dlg.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';


/** Dialog route. This route will be used by the DialogLoader, emulating the router, to lazily load the dialog */
const routes: RoutesWithContent = [{
  path: '',
  content: 'postdlg',
  component: PostDialogComponent,
  data: { dialogConfig: { maxWidth: '100%' }}
}];


@NgModule({
  declarations: [PostDialogComponent],
  imports: [CommonModule,
    MatDialogModule, 
    RouterModule,
  
    ContentRouterModule.forChild(routes)],
  exports: [],
  providers: [],
})
export class PostModule { }