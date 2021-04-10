import { Directive, Input, ComponentFactoryResolver, ViewContainerRef, ComponentRef, Injector, Type, Inject } from '@angular/core';
import { WidgetConfig, WidgetDirective } from './base-widget.directive';

/** The Widget Interface */
export interface Widget {
  type: string;
  loadComponent: () => Promise<Type<WidgetDirective<WidgetConfig>>>;
}

export type Widgets = Widget[];

/** The Widget Loader Directive. Dynamically loads the requested widget */
@Directive({
  selector: '[wm-load-widget]'
})
export class LoadWidgetDirective {

  private ref: ComponentRef<WidgetDirective<WidgetConfig>>;

  @Input('wm-load-widget') set widget(widget: WidgetConfig) {

    if(!widget || this.ref) { return; }

    this.loadWidget(widget);
  }

  private loadWidget(widget: WidgetConfig) {

    // Seeks for the requested widget loader
    const loader = this.widgets.find( w => w.type === widget.type );
    if(!loader) { return; }

    // Imports the component. Assuming the component has already being imported by the resolver, this call will return promptly
    loader.loadComponent().then( cmp => {

      // Resolves the widged=t component factory
      const factory = this.resolver.resolveComponentFactory(cmp);

      // Creates the widget component
      this.ref = this.view.createComponent(factory, null, this.injector) as any;

      // Sets the widget config to the instance input
      this.ref.instance.config = widget;
    });
  }

  constructor(@Inject('widgets') private widgets: Widgets, private view: ViewContainerRef, private resolver: ComponentFactoryResolver, private injector: Injector) {}
}
