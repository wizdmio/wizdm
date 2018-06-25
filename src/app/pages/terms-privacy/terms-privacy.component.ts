import { Component, OnInit } from '@angular/core';
import { ContentManager } from 'app/core';

@Component({
  selector: 'wm-terms-privacy',
  templateUrl: './terms-privacy.component.html',
  styleUrls: ['./terms-privacy.component.scss']
})
export class TermsPrivacyComponent implements OnInit {

  private msgs = null;
  
  constructor(private content: ContentManager) {}

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('terms');
  }
}
