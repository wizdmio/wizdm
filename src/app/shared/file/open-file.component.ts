import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'wm-open-file, [wm-open-file]',
  template: '<input fxHide type="file" [accept]="accept" [multiple]="!!multiple"\
            (change)="files.emit($event.target.files)" #input />\
             <ng-content></ng-content>',
  styles: []
})
/**
 * SImple component wrapping a file input to help in managing the file dialog window
 */
export class OpenFileComponent implements OnInit {

  @ViewChild('input', { read: ElementRef }) input: ElementRef;

  @Input() accept = 'image/*';

  @Input() multiple = false;

  @Output() files = new EventEmitter<FileList>();

  constructor() { }

  ngOnInit() { }

  public show(): void {
    this.input && 
    this.input.nativeElement && 
    this.input.nativeElement.click();
  }
}
