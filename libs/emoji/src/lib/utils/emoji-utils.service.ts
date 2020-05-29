import { Injectable, InjectionToken, Inject, Optional } from '@angular/core';
import { EmojiRegex, EmojiNative } from './emoji-utils';

/** Emoji Rendering Mode */
export type EmojiMode = 'auto'|'native'|'web';

export interface EmojiConfig {

  emojiPath?: string; //assets/...
  emojiExt?: string; //.png, .svg, ...
  emojiMode?: EmojiMode; //'auto'
};

export const EmojiConfigToken = new InjectionToken<EmojiConfig>('wizdm-emoji-config');

@Injectable()
export class EmojiUtils {

  public readonly  emojiMode: EmojiMode;
  private readonly filePath: string;
  private readonly fileExt: string;

  constructor(@Optional() @Inject(EmojiConfigToken) config: EmojiConfig, 
              @Inject(EmojiNative) readonly native: boolean,
              @Inject(EmojiRegex) readonly regex: RegExp) { 

    // Grabs the source path and the image extension from the configuration object
    this.filePath = this.assessPath(config && config.emojiPath) || 'assets/emoji/';
    this.fileExt  = this.assessExt(config && config.emojiExt)  || '.png';
    
    // Keep track of the global emoji rendering mode
    this.emojiMode = config.emojiMode || 'auto';
  }

  private assessPath(path: string): string {
    return path ? (path.endsWith('/') ? path : (path + '/')) : '';
  }

  private assessExt(ext: string): string {
    return ext ? (ext.startsWith('.') ? ext : ('.' + ext)) : '';
  }

  /** Computes the full path to load the image corersponding to the given emoji */
  public imageFilePath(emoji: string): string {

    if(!emoji) { return ''; }

    const pts: string[] = [];

    for (let cp of emoji) {
      pts.push(cp.codePointAt(0).toString(16));
    } 

    return this.filePath + pts.join('-') + this.fileExt;
  }

  public isEmoji(source: string): boolean {
    return this.regex.test(source);
  }

  public matchEmojiCodes(source: string): RegExpExecArray {
    this.regex.lastIndex = 0;
    return this.regex.exec(source);
  }

  /** Parses the source text searching for emoji unicode sequences */
  public parseEmojiCodes(source: string, callbackfn: (match: string, index: number) => void) {

    if(typeof callbackfn !== 'function') {
      throw new Error('Callback must be a funciton');
    }

    // Resets the starting position
    this.regex.lastIndex = 0;

    // Loop on RegExp matches
    let match;
    while(match = this.regex.exec(source)) {
      callbackfn(match[0], match.index);
    }
  }
}