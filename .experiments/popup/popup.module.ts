import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { PopupService } from './popup.service';
import { PopupComponent } from './popup.component';

@NgModule({
  declarations: [ PopupComponent ],
  imports: [ 
    CommonModule, 
    MatDialogModule, 
    MatButtonModule 
  ],
  providers: [PopupService],
  entryComponents: [ PopupComponent ],
  exports: [ PopupComponent ]
})
export class PopupModule {}
