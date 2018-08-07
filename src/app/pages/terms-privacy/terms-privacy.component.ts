import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ContentService } from 'app/core';
import { ToolbarService } from 'app/navigator/toolbar/toolbar.service';

@Component({
  selector: 'wm-terms-privacy',
  templateUrl: './terms-privacy.component.html',
  styleUrls: ['./terms-privacy.component.scss']
})
export class TermsPrivacyComponent implements OnInit {

  @Input() full = false; // Force the content to fit the full screen
  public msgs = null;
  
  constructor(private content: ContentService, 
              private toolbar: ToolbarService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {

    this.route.paramMap.subscribe( param => { 
      
      let version = param.get('version') || 'short';

      // Gets the localized content for the requested version (short/full)
      this.msgs = this.content.select(`${version}Terms`);

      // Activate the navigator action links
      this.toolbar.activateActions(this.msgs.actions);
    });
  }
}
