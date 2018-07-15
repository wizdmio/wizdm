import { Component, OnInit, Input } from '@angular/core';
import { ContentService } from '../../core';

@Component({
  selector: 'wm-terms-privacy',
  templateUrl: './terms-privacy.component.html',
  styleUrls: ['./terms-privacy.component.scss']
})
export class TermsPrivacyComponent implements OnInit {

  @Input() full = false; // Force the content to fit the full screen
  private msgs = null;
  
  constructor(private content: ContentService) {}

  ngOnInit() {

    // Gets the localized content for the short version (default)
    this.msgs = this.content.select('shortTerms');
  }

  private goFull() {

    // Switch content to the full version
    this.msgs = this.content.select('fullTerms');
  }
}
