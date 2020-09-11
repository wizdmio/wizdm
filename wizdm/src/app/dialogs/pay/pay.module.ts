import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { GtagModule } from '@wizdm/gtag';
import { ReadmeModule } from '@wizdm/readme';
import { RedirectModule } from '@wizdm/redirect';
import { loadStripeJS } from '@wizdm/stripe';
import { StripeModule } from '@wizdm/stripe';
import { StripeElementsModule } from '@wizdm/stripe/elements';
import { StripeCardModule } from '@wizdm/stripe/elements/card';
import { StripeMaterialModule } from '@wizdm/stripe/material';
import { PayComponent } from './pay.component';

// Environment
import { environment } from 'env/environment';
const  { stripeElements } = environment;

/** Dialog route. This route will be used by the DialogLoader, emulating the router, to lazily load the dialog */
const routes: RoutesWithContent = [{
  path: '',
  content: 'pay',
  component: PayComponent,
  // Resolves stripeJS making sure the script has been loaded by the time the dialog renders the StripeElements
  resolve: { stripe: 'loadStripeJS' }
}];

@NgModule({
  declarations: [PayComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    GtagModule,
    ReadmeModule,
    RedirectModule,
    StripeModule,    
    StripeCardModule,
    StripeMaterialModule,
    StripeElementsModule.init(stripeElements),
    ContentRouterModule.forChild(routes)
  ],
  // Provides stripe loading function as a simple resolver
  providers: [{ provide: 'loadStripeJS', useValue: () => loadStripeJS() }]
})
export class PayModule { }
