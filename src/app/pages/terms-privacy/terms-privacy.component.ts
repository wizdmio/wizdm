import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from 'app/core';
import { ToolbarService } from 'app/navigator';

@Component({
  selector: 'wm-terms-privacy',
  templateUrl: './terms-privacy.component.html',
  styleUrls: ['./terms-privacy.component.scss']
})
export class TermsPrivacyComponent implements OnInit {

  @Input() fullScreen = false; // Force the content to fit the full screen
  @Input() disableActions = false; // Prevent the activation of navigation actions
  public msgs = null;
  
  constructor(private content: ContentService, 
              private toolbar: ToolbarService,
              private route: ActivatedRoute) {}

  ngOnInit() {

    this.route.paramMap.subscribe( param => { 
      
      let version = param.get('version') || 'short';

      // Gets the localized content for the requested version (short/full)
      this.msgs = this.content.select(`${version}Terms`);

      // Activate the navigator action links
      if(this.disableActions === false) {
        this.toolbar.activateActions(this.msgs.actions);
      }
    });
  }

  // Switch content version without navigation (suitable to support the popup version)
  public switchVersion(version: string) {
    this.msgs = this.content.select(`${version}Terms`);
  }
}
