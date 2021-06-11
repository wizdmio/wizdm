import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { ReadmeModule } from '@wizdm/readme';
import { IconModule } from '@wizdm/elements/icon';
import { ConsentComponent } from './consent.component';

/** Dialog route. This route will be used by the LazyDialogLoader, emulating the router, to lazily load the dialog */
const routes: RoutesWithContent = [{
  path: '',
  content: 'consent',
  component: ConsentComponent,
  data: { dialogConfig: { maxWidth: '100%', disableClose: true }}
}];

@NgModule({

  declarations: [ ConsentComponent ],
  
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    ReadmeModule,
    IconModule,
    ContentRouterModule.forChild(routes)  
  ]
})
export class ConsentModule { }
