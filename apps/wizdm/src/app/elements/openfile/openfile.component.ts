import { Component, OnInit, Input, Output, EventEmitter, HostBinding, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'wm-openfile',
  templateUrl: './openfile.component.html',
  styleUrls: ['./openfile.component.scss'],
  host: { 'class': 'wm-openfile' },
  encapsulation: ViewEncapsulation.None
})
/**
 * Simple component wrapping a file input to help in managing the file dialog window
 */
export class OpenFileComponent  {

  @ViewChild('input', { read: ElementRef, static: true }) input: ElementRef;

  @HostBinding('attr.disabled')
  @Input() disabled: boolean;

  @Input() accept = 'image/*';

  @Input() multiple = false;

  @Output() files = new EventEmitter<FileList>();

  public open(): void {
    this.input && 
    this.input.nativeElement && 
    this.input.nativeElement.click();
  }
}
