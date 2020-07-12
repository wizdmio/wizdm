import { Directive, Optional, OnDestroy, Input, Output, EventEmitter, HostBinding, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Buttons, ButtonsLayout, ButtonsColor, ButtonsShape, ButtonsLabel } from './types/buttons';
import { OnShippingChangeData, OnShippingChangeActions } from './types/buttons';
import { OnApproveData, OnApproveActions } from './types/buttons';
import { OnCancelData, OnCancelActions } from './types/buttons';
import { OnClickData, OnClickActions } from './types/buttons';
import { OnInitData, OnInitActions } from './types/buttons';
import { SubscriptionRequest } from './types/subscription';
import { OnErrorData } from './types/buttons';
import { OrderRequest } from './types/order';
import { PayPal } from './types/paypal';
import { BehaviorSubject, Subscription } from 'rxjs';

export type ButtonsType = 'checkout'|'subscription';

export interface OnApprove {
  onApprove(OnApproveData, OnApproveActions): Promise<void>;
}

export interface OnShippingChange {
  onShippingChange(OnShippingChangeData, OnShippingChangeActions): Promise<void>;
}

/** PayPal processor abstract class */
export abstract class PayPalProcessor implements OnApprove, OnShippingChange {
  /** Called when the transaction has been approved for the payment to be captured */
  abstract onApprove(data: OnApproveData, actions: OnApproveActions): Promise<void>;
  /** Called when the shipping details has been changed for approval or rejection */
  abstract onShippingChange(data: OnShippingChangeData, actions: OnShippingChangeActions): Promise<void>;
}

/** PayPal Buttons */
@Directive({ selector: 'wm-paypal' })
export class PayPalButtons implements OnChanges, OnDestroy {

  private disable$ = new BehaviorSubject<boolean>(false);

  private sub: Subscription;
  
  private _buttons: Buttons;

  /** True when disabled */
  get disabled(): boolean { return this.disable$.value; }
  
  constructor(private paypal: PayPal, private el: ElementRef<HTMLElement>, @Optional() private processor: PayPalProcessor) {}

  // Tweak the component style to reflect the disabled status
  @HostBinding('style.opacity') get opacity() { return this.disabled ? '0.33' : undefined; }
  @HostBinding('style.pointer-events') get cursor() { return this.disabled ? 'none' : undefined; }

  // Style inputs
  @Input() label:   ButtonsLabel;
  @Input() color:   ButtonsColor;
  @Input() shape:   ButtonsShape;
  @Input() layout:  ButtonsLayout;
  @Input() tagline: boolean;
  @Input() height:  number; // 25..55

  // Buttons type
  @Input() type: ButtonsType = 'checkout';

  /** Order or Subscription request to be processed when the button is clicked. The interpretation of the input depends upon
   * the type input */
  @Input() request: OrderRequest|SubscriptionRequest;

  /** Disables the buttons */
  @Input() set disabled(disabled: boolean) {
    this.disable$.next(disabled);
  }

  /** Emits on Click */
  @Output() click = new EventEmitter<OnClickData>();

  /** Emits on Approve */
  @Output() approve = new EventEmitter<OnApproveData>();

  /** Emits on Cancel */
  @Output() cancel = new EventEmitter<OnCancelData>();

  /** Emits on Error */
  @Output() error = new EventEmitter<OnErrorData>();

  /** Emits on ShippingChange */
  @Output() shippingChange = new EventEmitter<OnShippingChangeData>();

  ngOnChanges(changes: SimpleChanges) {

    // Checks if input changes require the buttons to be rendered
    if(this.needRender(changes)) {

      // Prepare to render with an arrow function
      const render = () => (this._buttons = this.buttons()).render(this.el.nativeElement);
      // Render the new buttons immediately or right after closing the previous ones
      this._buttons && this._buttons.close().then(render) || render();
    }
  }

  // Returns true for any of the relevant input change
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
  private buttons(): Buttons {
    // Reverts on the PayPal service for rendering the buttons  
    return this.paypal.Buttons({  

      // Builds the buttons style from the inputs
      style: {
        layout: this.layout,
        label: this.label,
        color: this.color,
        shape: this.shape,
        tagline: this.layout === 'horizontal' && this.tagline,
        height: this.height
      },

      // Handles buttons initialization
      onInit: (data: OnInitData, actions: OnInitActions) => {
        // Unsubscribes previous subscriptions, if any
        this.sub && this.sub.unsubscribe();
        // Subscribes to the disable observable
        this.sub = this.disable$.subscribe( disabled => {
          // Disables/Enables the buttons according to the disable observable value 
          if(disabled) { actions.disable(); }
          else { actions.enable(); }
        })
      },

      // Handles button clicks
      onClick: (data: OnClickData, actions: OnClickActions) => {
        // Emits the onClick data
        this.click.emit(data);
        // Prevents the execution when no orders nor subscriptions are defined
        return !!this.request ? actions.resolve() : actions.reject();
      },
      
      // Handles order creation for checkouts
      createOrder: this.type === 'checkout' ? (_,actions) => actions.order.create(this.request) : undefined,

      // Handles subscription creation otherwise
      createSubscription: this.type === 'subscription' ? (_,actions) => actions.subscription.create(this.request) : undefined,
      
      // Handles order capturing and subscription activation
      onApprove: (data: OnApproveData, actions: OnApproveActions) => {

        // Emits the approve event
        this.approve.emit(data);

        // Delegates the PayPalProvessor whenever defined
        if(!!this.processor && typeof(this.processor.onApprove) == 'function') {
          return this.processor.onApprove(data, actions);
        }
      },
      
      // Simply emits the cancel event
      onCancel: data => this.cancel.emit(data),
      // Simply emits the error event
      onError: data => this.error.emit(data),
      
      // Handles the shipping changes
      onShippingChange: (data: OnShippingChangeData, actions: OnShippingChangeActions) => {
       
        // Emits the shipping change event
        this.shippingChange.emit(data);

        // Delegates the PayPalProvessor whenever defined
        if(!!this.processor && typeof(this.processor.onShippingChange) == 'function') {
          return this.processor.onShippingChange(data, actions);
        }
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribes the observables
    this.sub && this.sub.unsubscribe();
    // Closes the buttons 
    this._buttons && this._buttons.close()
  }
}