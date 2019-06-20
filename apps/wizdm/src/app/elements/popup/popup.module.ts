import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { PopupService } from './popup.service';
import { PopupComponent } from './popup.component';

@NgModule({
  declarations: [PopupComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  // Exposes the PopupService here, so, it'll belong to the same module where the PopupComponent is registered
  providers: [PopupService],
  // Lists the component among the entry one so to be dinamically created by the PopupService
  entryComponents: [PopupComponent]
})
export class PopupModule {}
