import { Directive, Input, ComponentFactoryResolver, ViewContainerRef, ComponentRef, Injector, Type, Inject } from '@angular/core';
import { WidgetConfig, WidgetDirective } from './base-widget.directive';

export interface Widget {
  type: string;
  loadComponent: () => Promise<Type<WidgetDirective<WidgetConfig>>>;
}

export type Widgets = Widget[];

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

    const loader = this.widgets.find( w => w.type === widget.type );

    if(!loader) { return; }

    loader.loadComponent().then( cmp => {

      const factory = this.resolver.resolveComponentFactory(cmp);

      this.ref = this.view.createComponent(factory, null, this.injector) as any;

      this.ref.instance.config = widget;
    });
  }

  constructor(@Inject('widgets') private widgets: Widgets, private view: ViewContainerRef, private resolver: ComponentFactoryResolver, private injector: Injector) {}
}
