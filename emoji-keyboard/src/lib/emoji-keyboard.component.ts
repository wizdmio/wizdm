import { Component, Input, Output, EventEmitter, Inject, ViewEncapsulation, ElementRef, NgZone, ViewChild } from '@angular/core';
import { sample, map, take, tap, startWith, switchMap, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { Observable, fromEvent, combineLatest, of, BehaviorSubject } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { EMOJI_KEYS, EmojiGroup } from './emoji-keys';
import { runInZone } from '@wizdm/rxjs';

@Component({
  selector: 'wm-emoji-keyboard',
  templateUrl: './emoji-keyboard.component.html',
  styleUrls: ['./emoji-keyboard.component.scss'],
  host: { "class": "wm-emoji-keyboard" },
  encapsulation: ViewEncapsulation.None
})
export class EmojiKeyboardComponent {

  @ViewChild(CdkVirtualScrollViewport) scroller: CdkVirtualScrollViewport;

  private favorites$ = new BehaviorSubject<string[]>([]);
  readonly currentId$: Observable<string>;
  readonly rows$: Observable<any[]>;

  private offsets: { [key:string]: number };
  readonly keySize = 40;

  /** The latest favorites */
  get favorites(): string[] { return this.favorites$.value; }

   /** Mode flag:
   * 'web' renders emoji as images
   * 'native' renders the text as it is relying on the OS native support
   */
  @Input() mode: 'native'|'web' = 'web';

  /** Array of favorites emoji for the 'Recenlty used' group */
  @Input() set favorites(favs: string[]) {
    this.favorites$.next(favs);
  }

  /** Optional alternative labels for the emoji groups */
  @Input() labels: { [key:string]: string };

  /** Disables the keyboard */
  @Input() set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  get disabled(): boolean { return this._disabled; }
  private _disabled: boolean = false;

  /** Emits the selected emoji */
  @Output() keyPressed = new EventEmitter<string>();

  constructor(@Inject(EMOJI_KEYS) readonly emojis: EmojiGroup[], elref: ElementRef<HTMLElement>, zone: NgZone) { 

    // Rows observable adjusting on window resize to work with virtual scrolling
    this.rows$ = fromEvent(window, 'resize').pipe( 
      // Makes sure to start with a value
      startWith(null),
      // Waits for rendering to complete
      sample(zone.onStable),
      // Computes the number of columns based on the actual width
      map( () => Math.floor(elref.nativeElement.scrollWidth / this.keySize) ),
      // Filters for changes
      distinctUntilChanged(),
      // Combines favorites with all emoji keys
      switchMap( cols => combineLatest(
        // Splits the favorites first
        this.favorites$.pipe( map( favs => {
          // Skips when no favorites
          if(!favs || favs.length <= 0) { return []; }
          // Returns the group of recently used 
          return ([{ 
            name: 'Recently used', 
            id: 'recently_used' 
          }] as any[]).concat( this.spliRows(favs, cols) );
        })),
        // Splits the emoji groups
        of(this.emojis.reduce( (out, group: any) => {
          // Pushes the group first 
          out.push({ name: group.name, id: group.id });
          // Concats the key rows next
          return out.concat( this.spliRows(group.keys, cols) );
        }, []))
      )), 
      // Concatenates the recently Used with groups
      map( ([recentlyUsed, emojiGroups]) => recentlyUsed.concat(emojiGroups) ),
      // At last, computes the scrolling offset for each group
      tap( rows => this.offsets = this.computeOffsets(rows) )
    );

    // Builds the current group id observable
    this.currentId$ = zone.onStable.pipe( 
      // Waits for the rendering to complete
      take(1), 
      // Updates with scrolling
      switchMap( () => this.scroller.elementScrolled() ),
      // Measures the scrolled offset
      map( () => this.scroller.measureScrollOffset('top') ),
      // Makes sure to start with 0 offset
      startWith(0),
      // Detects the group based on the scrolled offset 
      map( top => {
        // Computes a reversed array of group ids 
        const ids = Object.keys(this.offsets || {}).reverse();
        // Seeks for the current group id
        return ids.find( key => top >= this.offsets[key] ) ||  'recently_used';
      }),
      // Filters for changes
      distinctUntilChanged(),
      // Runs within the angular's zone
      runInZone(zone),
      // Shares the same observable among subscribers
      shareReplay(1)
    )
  }

  ngDoCheck() {

    //this.scroller?.checkViewportSize();

  }

  /** Splits the given array of emoji keys into chuncks of the proper length */
  private spliRows(keys: string[], count: number): string[][] {

    return Array( Math.ceil(keys.length / (count || 1)))
      .fill(0).map( (_, i) => keys.slice(i * count, i * count + count ));
  }

  /** Computes a map of emoji group offsets */
  private computeOffsets(rows: any[]) {

    return this.emojis.reduce( (map, group) => {

      map[group.id] = this.keySize * rows.findIndex( row => row.id === group.id );

      return map;
    }, {});
  }

  /** Scrolls to the given emoji group */
  public scrollTo(id: string) {
    this.scroller.scrollTo({ top: this.offsets[id] || 0 });
  }

  /** Emits the emoji key */
  public press(key: string) {
    return this.keyPressed.emit(key), false;
  }
}