import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'wm-file-open, [wm-file-open]',
  template: `<input [style.display]="'none'" type="file" [accept]="accept" [multiple]="!!multiple"
            (change)="files.emit($event.target?.files)" #input />
             <ng-content></ng-content>`,
  styles: []
})
/**
 * Simple component wrapping a file input to help managing the file dialog window
 */
export class FileOpenComponent implements OnInit {
  @ViewChild('input', { read: ElementRef })
  input: ElementRef;

  @Input() accept = 'image/*';

  @Input() multiple = false;

  @Output() files = new EventEmitter<FileList>();

  constructor() {}

  ngOnInit() {}

  public show(): void {
    this.input && this.input.nativeElement && this.input.nativeElement.click();
  }
}
