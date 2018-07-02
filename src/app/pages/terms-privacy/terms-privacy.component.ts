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

    // Gets the localized content for the short version (default)
    this.msgs = this.content.select('shortTerms');
  }

  private goFull() {

    // Switch content to the full version
    this.msgs = this.content.select('fullTerms');
  }
}
