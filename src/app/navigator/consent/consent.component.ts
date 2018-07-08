import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { trigger, animate, style, transition } from '@angular/animations';
import { CookieService } from 'app/utils/cookie/cookie.service';
import { ContentService } from 'app/core';
 
@Component({
  selector: 'wm-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss'],
  animations: [ 
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in',
          style({ opacity: 1 })
        )] 
      ),
      transition(':leave', [
        animate('200ms ease-out', 
          style({ opacity: 0 })
        )] 
      )
    ])
   ] 
})
export class ConsentComponent implements OnInit, AfterViewInit {

  @ViewChild('content', { read: ElementRef }) body: ElementRef;
  @ViewChild('shadow', { read: ElementRef }) shadow: ElementRef;

  private visible: boolean = true;
  private msgs;

  constructor(private content: ContentService,
              private cookies: CookieService) { }

  ngOnInit() {

    // Gets the localized user messages from content service
    this.msgs = this.content.select('navigator.consent');

    // Check the cookie value of a previous consent agreement
    let value = this.cookies.get('cookieConsent');
    this.visible = !(value && value == 'agreed');
  }

  ngAfterViewInit() {

    if(this.shadow && this.body) {

      // Copies 'content's HTML into 'shadow' so to make sure
      // the transparent background will resize as the foreground
      // This is a workaround to have solid foreground on top of a 
      // semi-transparent background
      this.shadow
        .nativeElement
        .innerHTML = this.body
                      .nativeElement
                      .innerHTML;
      }
  }

  private onDismiss() {

    this.visible = false;

    this.cookies.put('cookieConsent','agreed');
  }
}
