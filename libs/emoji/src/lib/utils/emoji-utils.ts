import { InjectionToken, inject } from '@angular/core';
import { emojiRegex } from './emoji-regex';
import { emojiNames } from './emoji-names';
import { DOCUMENT } from '@angular/common';

export const EmojiRegex = new InjectionToken<RegExp>('wizdm-emoji-regex', {
  providedIn: 'root',
  factory: () => emojiRegex
});

export interface EmojiName {
  keywords: string[];
  char: string;
  fitzpatrick_scale: boolean;
  category: string;
}

export const EmojiNames = new InjectionToken<{ [name:string]: string }>('wizdm-emoji-names', {
  providedIn: 'root',
  factory: () => emojiNames
});


export const EmojiNative = new InjectionToken<boolean>('wizdm-native-emoji-support', {
  providedIn: 'root',
  factory: () => checkNativeEmojiSupport( inject(DOCUMENT) )
});

function checkNativeEmojiSupport(document: Document): boolean {

  const canvas = document.createElement('canvas');
  if(!canvas.getContext || !canvas.getContext('2d') || typeof canvas.getContext('2d').fillText !== 'function') {
    return false;
  }

  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '32px Arial';
  ctx.fillText('\ud83d\ude03', 0, 0);
  return ctx.getImageData(16, 16, 1, 1).data[0] !== 0;
}