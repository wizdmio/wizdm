import { Directive, HostListener, Input, Output, EventEmitter, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive({
  selector: '[fileDialog]',
  exportAs: 'fileDialog'
})
export class FileDialogDirective implements OnDestroy {

  private input: HTMLInputElement;
  private unlisten: () => void;

  constructor(private ref: ElementRef<HTMLElement>, private renderer: Renderer2) { 

    this.input = renderer.createElement('input');

    renderer.setStyle(this.input, "display", "none");
    renderer.setProperty(this.input, "type", "file");
    renderer.setProperty(this.input, "accept", "image/*");
    renderer.setProperty(this.input, "multiple", false);
    
    this.unlisten = renderer.listen(this.input, 'change', () => {

      if(this.input.files.length > 0) { 
        
        this.openFiles.emit(this.input.files); 
      }
      else { this.openNone.emit(); }
    });
    
    renderer.appendChild(ref.nativeElement, this.input);
  }

  /** Gets the optional value */
  @Input() fileDialog: string;
  
  /** Specifies the types of files accepted */
  @Input() accept: string;

  /** Enables multiple files seleciton */
  @Input() multiple: boolean;

  /** Emits the list of selected files */
  @Output() openFiles = new EventEmitter<FileList>();

  /** Emits when no files were selected */
  @Output() openNone = new EventEmitter<void>();

  @HostListener('click') onClick() {

    this.renderer.setProperty(this.input, "accept", this.accept || 'image/*');

    this.renderer.setProperty(this.input, "multiple", coerceBooleanProperty(this.multiple) );

    this.renderer.setValue(this.input, this.fileDialog || '');

    this.input.click();
  }

  ngOnDestroy() {

    if(!this.input) { return; }

    this.unlisten();

    this.ref.nativeElement.removeChild(this.input);

    delete this.input;
  }
}
