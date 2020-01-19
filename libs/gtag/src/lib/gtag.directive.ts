import { Directive, Input, OnChanges, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { GtagService } from './gtag.service';

@Directive({
  selector: '[gtag]'
})
export class GtagDirective implements OnChanges {

  constructor(private gtag: GtagService, @Optional() private router: Router) {}

  @Input('gtag') title: string;

  @Input() path: string;

  @Input() location: string;

  ngOnChanges() {
    this.gtag.pageView(this.title, this.path, this.location || this.router && this.router.url);
  }
}