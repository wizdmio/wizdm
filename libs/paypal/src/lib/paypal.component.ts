import { Component, OnDestroy, Input, Output, EventEmitter, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Buttons, ButtonsStyle, ButtonsLayout, ButtonsColor, ButtonsShape, ButtonsLabel } from './types/buttons';
import { CreateSubscriptionData, CreateSubscriptionActions } from './types/buttons';
import { OnErrorData, OnClickData, OnClickActions } from './types/buttons';
import { CreateOrderData, CreateOrderActions } from './types/buttons';
import { OnApproveData, OnApproveActions } from './types/buttons';
import { OnCancelData, OnCancelActions } from './types/buttons';
import { OnInitData, OnInitActions } from './types/buttons';
import { SubscriptionRequest } from './types/subscription';
import { OrderRequest } from './types/order';
import { PayPal } from './types/paypal';
import { BehaviorSubject, Subscription } from 'rxjs';

export type ButtonsType = 'checkout'|'subscription';

@Component({
  selector: 'wm-paypal',
  template: ''
})
export class PayPalButtons implements OnChanges, OnDestroy {

  private disable = new BehaviorSubject<boolean>(false);
  private sub: Subscription;
  private _buttons: Buttons;
  
  constructor(private paypal: PayPal, private el: ElementRef<HTMLElement>) {}

  // Buttons type
  @Input() type: ButtonsType = 'checkout';

  // Style inputs
  @Input() label:   ButtonsLabel;
  @Input() color:   ButtonsColor;
  @Input() shape:   ButtonsShape;
  @Input() layout:  ButtonsLayout;
  @Input() tagline: boolean;
  @Input() height:  number; // 25..55

  /** Order or Subscription request to be processed when the button is clicked. The interpretation of the input depends upon
   * the type attribute.
  */
  @Input() request: OrderRequest|SubscriptionRequest;

  /** Disables the buttons */
  @Input() set disabled(disabled: boolean) {
    this.disable.next(disabled);
  }

  /** Emits on Click */
  @Output() click = new EventEmitter<OnClickData>();

  /** Emits on Approve */
  @Output() approve = new EventEmitter<{ 
    data: OnApproveData, 
    actions: OnApproveActions 
  }>();

  /** Emits on Cancel */
  @Output() cancel = new EventEmitter<{
    data: OnCancelData,
    actions: OnCancelActions
  }>();

  /** Emits on Error */
  @Output() error = new EventEmitter<OnErrorData>();

  /** Builds the buttons style based on inputs */
  private get style(): ButtonsStyle {

    return {
      layout: this.layout,
      label: this.label,
      color: this.color,
      shape: this.shape,
      tagline: this.layout === 'horizontal' && this.tagline,
      height: this.height
    };
  }

  ngOnChanges(changes: SimpleChanges) {

    // Checks if input changes require the buttons to be rendered
    if(this.needRender(changes)) {

      // Prepare to render with an arrow function
      const render = () => (this._buttons = this.buttons(this.style)).render(this.el.nativeElement);

      // Render the new buttons immediately or right after closing the previous ones
      this._buttons && this._buttons.close().then(render) || render();
    }
  }

  private needRender(changes: SimpleChanges): boolean {

    return !!changes.type ||
           !!changes.label ||
           !!changes.color ||
           !!changes.shape ||
           !!changes.layout ||
           !!changes.tagline ||
           !!changes.height;
  }

  // Renders the Smart Buttons
  private buttons(style: ButtonsStyle): Buttons {
    // Reverts on the PayPal service for rendering the buttons  
    return this.paypal.Buttons({  
      // Applies the requested style
      style,
      // Defines the create order/subscription handler depending on the type attribute. Only one handler is allowed.
      createOrder: this.type === 'checkout' && this.createOrder.bind(this) || undefined,
      createSubscription: this.type === 'subscription' && this.createSubscription.bind(this) || undefined,
      // Defines all the other handlers
      onApprove: this.onApprove.bind(this),
      onCancel: this.onCancel.bind(this),
      onError: this.onError.bind(this),
      onClick: this.onClick.bind(this),
      onInit: this.onInit.bind(this) 
    });
  }

  // Creates an order request based upon the order input
  private createOrder(data: CreateOrderData, actions: CreateOrderActions) {
    console.log('createOrder', data);   
    return actions.order.create(this.request);
  }

  // Creates a subscription request based upon the subscription input
  private createSubscription(data: CreateSubscriptionData, actions: CreateSubscriptionActions)  {
    console.log('createSubscription', data);   
    return actions.subscription.create(this.request);
  }

  private onApprove(data: OnApproveData, actions: OnApproveActions) {
    console.log('Approving transaction:', data, actions);
    this.approve.emit({ data, actions });
  }

  private onCancel(data: OnCancelData, actions: OnCancelActions){
    console.log('OnCancel', data, actions);
    this.cancel.emit({ data, actions });
  }

  private onError(error: OnErrorData) {
    console.log('OnError', error);
    this.error.emit(error);
  }

  private onClick(data: OnClickData, actions: OnClickActions) {
    console.log('onClick', data, actions);
    // Emits the onClick data
    this.click.emit(data);
    // Prevents the execution when no orders nor subscriptions are defined
    return !!this.request ? actions.resolve() : actions.reject();
  }

  private onInit(data: OnInitData, actions: OnInitActions) {
    console.log('onInit', data, actions);
    // Unsubscribes previous subscriptions, if any
    this.sub && this.sub.unsubscribe();
    // Subscribes to the disable observable
    this.sub = this.disable.subscribe( disabled => {
      // Disables/Enables the buttons according to the disable observable value 
      if(disabled) { actions.disable(); }
      else { actions.enable(); }
    });
  }

  ngOnDestroy() {
    // Unsubscribes the observables
    this.sub && this.sub.unsubscribe();
    // Closes the buttons 
    this._buttons && this._buttons.close()
  }
}