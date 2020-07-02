import { Directive, Input } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Directive({
  selector: '[wmTitle]'
})
export class TitleDirective {

  constructor(private title: Title, private meta: Meta ) { }

  /** Updates the page title */
  @Input() set wmTitle(title: string) {

    this.title.setTitle(title || '');
  }

  /** Update the description meta-tag */
  @Input() set description(description: string) {

    this.meta.updateTag({ content: description || '' }, "name='description'");
  }
}
