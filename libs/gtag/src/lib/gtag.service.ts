import { Injectable, InjectionToken, Inject, NgZone } from '@angular/core';
import { Gtag, EventParams, CustomParams, Product, Promotion, Action, Content } from './gtag-definitions';
import { GtagConfigToken, GtagConfig } from './gtag-factory';

export const GTAG = new InjectionToken<Gtag>('wizdm.gtag.instance');

@Injectable()
export class GtagService {

  constructor(@Inject(GTAG) private gtag: Gtag, @Inject(GtagConfigToken) private config: GtagConfig, private zone: NgZone) { }

  /** Disables the analytics for the given measurement id. Defaults to the targetId from the global confguration when unspecified.
   * @see: https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out */
  public disable(value: boolean = true, id: string = this.config.targetId) {
    window[`ga-disable-${id}`] = value;
  }

  /** Helper function to re-enable analytics after it was disabled */
  public enable() { return this.disable(false); }

  /** @see: https://developers.google.com/analytics/devguides/collection/gtagjs/setting-values */
  public set(params: CustomParams): void {
    return this.gtag('set', params);
  }

  /** @see: https://developers.google.com/analytics/devguides/collection/gtagjs/events */
  public event(action: string, params?: EventParams): Promise<void> {
    // Wraps the event call into a Promise
    return this.zone.runOutsideAngular( () => new Promise( (resolve, reject) => {
      try { 
        // Triggers a 1s time-out timer 
        const tmr = setTimeout( () => reject( new Error('gtag call timed-out')), this.config.timeout || 10000 );
        // Performs the event call resolving with the event callback
        this.gtag('event', action, { ...params, event_callback: () => { clearTimeout(tmr); resolve(); }}); } 
      // Rejects the promise on errors
      catch(e) { reject(e); }
    }));
  }

  /** @see: https://developers.google.com/analytics/devguides/collection/gtagjs/pages */
  public pageView(page_title?: string, page_path?: string, page_location?: string) { 
    return this.event('page_view', { page_title, page_location, page_path }); 
  }

  /** @see: https://developers.google.com/analytics/devguides/collection/gtagjs/exceptions */
  public exception(description?: string, fatal?: boolean) { 
    return this.event('exception', { description, fatal }); 
  }

  /** @see: https://developers.google.com/analytics/devguides/collection/gtagjs/user-timings */
  public timingComplete(name: string, value: number, event_category?: string, event_label?: string) { 
    return this.event('timing_complete', { name, value, event_category, event_label }); 
  }

  /** @see: https://developers.google.com/analytics/devguides/collection/gtagjs/screens */
  public screenView(app_name: string, screen_name: string, app_id?: string, app_version?: string, app_installer_id?: string) { 
    return this.event('screen_view', { app_name, screen_name, app_id, app_version, app_installer_id }); 
  }

  public login(method?: string) {
    return this.event('login', { method });
  }

  public signUp(method?: string) {
    return this.event('sign_up', { method });
  }

  public search(search_term?: string) {
    return this.event('search', { search_term });
  }

  public selectContent(content?: Content) {
    return this.event('select_content', content);
  }

  public share(method?: string, content?: Content) {
    return this.event('share', { method, ...content });
  }

   public generateLead(action?: Action) {
    return this.event('generate_lead', action);
  }

  public viewItem(items?: Product[]) {
    return this.event('view_item', { items });
  }

  public viewItemList(items?: Product[]) {
    return this.event('view_item_list', { items });
  }

  public viewPromotion(promotions?: Promotion[]) {
    return this.event('view_promotion', { promotions });
  }

  public viewSearchResults(search_term?: string) {
    return this.event('view_search_results', { search_term });
  }

  public addPaymentInfo() {
    return this.event('add_payment_info');
  }

  public addToCart(action?: Action) {
    return this.event('add_to_cart', action);
  }

  public addToWishlist(action?: Action) {
    return this.event('add_to_wishlist', action);
  }

  public beginCheckout(action?: Action) {
    return this.event('begin_checkout', action);
  }

  public checkoutProgress(action?: Action) {
    return this.event('checkout_progress', action);
  }

  public purchase(action?: Action) {
    return this.event('purchase', action);
  }

  public refund(action?: Action) {
    return this.event('refund', action);
  }

  public removeFromCart(action?: Action) {
    return this.event('remove_from_cart', action);
  }

  public setCheckoutOption(checkout_step?: number, checkout_option?: string) {
    return this.event('set_checkout_option', { checkout_step, checkout_option });
  }
}