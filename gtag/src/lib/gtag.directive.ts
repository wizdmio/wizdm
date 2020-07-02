import { Directive, Input, OnChanges, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { GtagService } from './gtag.service';

@Directive({
  selector: '[gtag]'
})
export class GtagDirective implements OnChanges {

  constructor(private gtag: GtagService, @Optional() private router: Router) {}

  /** Page title */
  @Input('gtag') title: string;

  /** Optional path */
  @Input() path: string;

  /** Optional location otherwise automatically derived from the activated route */
  @Input() location: string;

  ngOnChanges() {

    // Skips whenever the title is empty or null
    if(!this.title) { return; }

    // Notifies the pageView
    this.gtag.pageView(this.title, this.path, this.location || this.router && this.router.url);
  }
}