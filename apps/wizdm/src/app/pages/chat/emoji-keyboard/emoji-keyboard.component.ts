import { Component, Input, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ContentStreamer } from '@wizdm/content';
import { EmojiUtils } from '@wizdm/emoji/utils';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'wm-emoji-keyboard',
  templateUrl: './emoji-keyboard.component.html',
  styleUrls: ['./emoji-keyboard.component.scss'],
  host: { "class": "wm-emoji-keyboard" },
  encapsulation: ViewEncapsulation.None,
  providers: [ ContentStreamer ]
})
export class EmojiKeyboard {

  @ViewChild(MatExpansionPanel) private panel: MatExpansionPanel; 

  readonly rows$ = new BehaviorSubject<number>(5);
  readonly columns$: Observable<string[][]>;
  readonly keySize = 40;

  constructor(private content: ContentStreamer, private utils: EmojiUtils) {

    // Builds the columns observable
    this.columns$ = this.rows$.pipe( switchMap( rows =>
      // Streams the keys groups from content
      this.content.stream('emoji-keys').pipe( 
        // Maps the keys groups into a single array with all keys
        map( (groups: []) => (groups || []).reduce( (keys, group: any) => keys.concat(group.keys), []) ),
        // Maps the allkeys array into columns of the given rows
        map( keys => {
          // Splits the columns
          const column = []; 
          return keys.reduce( (columns, key: string) => {
  
            column.push(key);
  
            if(column.length >= rows) {
              columns.push(column.splice(0));
            }
  
            return columns;
          }, []);
        })
      )
    ));
  }

  /** Behavior flag either returning 'web' or 'native' depending on the current behavior */
  get behavior(): 'native'|'web' {
    return this.mode === 'auto' ? (this.utils.native ? 'native' : 'web') : this.mode;
  }

  /** The number of rows */
  get rows(): number { return this.rows$.value; }

  /** The height of the viewport */
  get viewportHeight(): number {
    return this.rows * this.keySize;
  }

  /** Mode flag:
   * 'web' renders emoji as images
   * 'native' renders the text as it is relying on the OS native support
   * 'auto' detects the availability of native support and chooses accordingly
   */
  @Input() mode: 'auto'|'native'|'web' = 'auto';

  @Input() favorites: string[];

  @Output() keyPressed = new EventEmitter<string>();
  
  @Input('rows') set updateColumns(rows: number) {
    this.rows$.next(rows);
  };

  /** Toggles the keyboard */
  public toggle() {
    // Toggles the expansion panel and prevents default to avoid getting the focus
    return this.panel.toggle(), false;
  }

  public press(key: string) {
    // Closes the panel
    this.panel.close();
    // emits the pressed key and prevents default to avoid getting the focus
    return this.keyPressed.emit(key), false;
  }
}