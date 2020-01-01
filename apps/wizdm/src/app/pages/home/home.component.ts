import { Component } from '@angular/core';

@Component({
  selector: 'wm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: { 'class': 'wm-page adjust-top' }
})
export class HomeComponent {

  //readonly baseHref$: Observable<string>;
  //readonly msgs$: Observable<any>;

  constructor() {

    // Gets the localized content pre-fetched during routing resolving
    //this.msgs$ = content.stream('home');

    // Computes the baseHref making sure svg gradients/filters will work in 
    // Firefox and Safari although index.html defines <base href="..."> tag 
    // breaking relative url() resolution (works fine in Chrome, btw) 
    //this.baseHref$ = this.content.language$.pipe( delay(250) );
  }
}
