import { Component, OnChanges, SimpleChanges, Input, ViewEncapsulation } from '@angular/core';
import { EmojiUtils } from '@wizdm/emoji/utils';
import { EmojiMode } from '@wizdm/emoji/utils';

export interface emSegment {
  type: 'text'|'emoji';
  content: string;
}

@Component({
  selector: '[wm-emoji-text]',
  templateUrl: './emoji-text.component.html',
  styleUrls: ['./emoji-text.component.scss'],
  host: { "class": "wm-emoji-text" },
  encapsulation: ViewEncapsulation.None
})
export class EmojiText implements OnChanges {

  readonly segments: emSegment[] = [];
  
  constructor(readonly utils: EmojiUtils) { 
    // Setup the default mode
    this.mode = undefined;
  }

  /** Plain text source input */
  @Input('wm-emoji-text') value: string;
    
  /** Mode flag:
   * 'web' renders emoji as images
   * 'native' renders the text as it is relying on the OS native support
   * 'auto' detects the availability of native support and chooses accordingly
   */
  @Input() mode: EmojiMode;

  /** Behavior flag either returning 'web' or 'native' depending on the current behavior */
  get behavior(): Exclude<EmojiMode, 'auto'> { 
    // Returns the best suitable emoji mode according to the global config
    return this.utils.emojiMode(this.mode); 
  }

  public ngOnChanges(changes: SimpleChanges) {
    
    // Compiles the source text into segments
    (changes.value || changes.mode) && this.compile(this.value); 
  }

  // Tracking function to render the segments by content preventing re-rendering segments where content is unchanged
  public trackByFn(index: number, item: emSegment) {
    return item.type + item.content;
  }

  /** Compiles the source text into an array of eather text or emoji segments */
  protected compile(source: string): number {
    // Resets the segments array
    this.segments.splice(0);
    // Skips null or emptiìy sources
    if(!source) { return 0; }
    // Short-circuit to the source text when native behavior is requested
    if(this.behavior === 'native') {
      return this.segments.push({ type: 'text', content: source });
    }
    // Resets the start index
    let start = 0;
    // Parses the source text for emoji unicode sequences
    this.utils.parseEmojiCodes(source, (match, index) => {
       // Pushes the text preceeding the match 
      if(index > start){ 
        const content = source.substring(start, index);
        this.segments.push({ type: "text", content });   
      }
      // Pushes the emoji sequence
      this.segments.push({ type: 'emoji', content: match });
      // Keeps track of the next beginning for the eventual plain text between this match and the next
      start = index + match.length;
    });
    // Appends the final text chunk 
    if(start < source.length) {
      const content = source.substring(start, source.length);
      this.segments.push({ type: "text", content });
    }

    return this.segments.length;
  }
}