import { Component, Input, Output, EventEmitter, HostBinding, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

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

  @ViewChild('input', { static: true, read: ElementRef }) input: ElementRef;

  @Input() accept = 'image/*';

  @Input('multiple') set multipling(value: boolean) { this.multiple = coerceBooleanProperty(value); }
  public multiple = false;

  @Input('disabled') set disabling(value: boolean) { this.disabled = coerceBooleanProperty(value); }
  @HostBinding('attr.disabled')
  public disabled = false;

  @Output() files = new EventEmitter<FileList>();

  public open(): void {
    this.input && 
    this.input.nativeElement && 
    this.input.nativeElement.click();
  }
}

