import { SnapshotDataPipe, TimestampPipe, CreatedTimePipe, UpdatedTimePipe } from './pipes.pipe';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ SnapshotDataPipe, TimestampPipe, CreatedTimePipe, UpdatedTimePipe ],
  exports: [ SnapshotDataPipe, TimestampPipe, CreatedTimePipe, UpdatedTimePipe ]
})
export class PipesModule { }
