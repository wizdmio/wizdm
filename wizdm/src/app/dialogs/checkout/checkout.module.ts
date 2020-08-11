import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
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
import { StripeElementsModule } from '@wizdm/stripe/elements';
import { StripeCardModule } from '@wizdm/stripe/elements/card';
import { StripeMaterialModule } from '@wizdm/stripe/material';
import { CheckoutComponent } from './checkout.component';

// Environment
import { environment } from 'env/environment';
const  { stripeElements } = environment;

/** Dialog route. This route will be used by the DialogLoader, emulating the router, to lazily load the dialog */
const routes: RoutesWithContent = [{
  path: '',
  content: 'checkout',
  component: CheckoutComponent
}];

@NgModule({
  declarations: [ CheckoutComponent ],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatDialogModule,
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
    StripeCardModule,
    StripeMaterialModule,
    StripeElementsModule.init(stripeElements),
    ContentRouterModule.forChild(routes)
  ]
})
export class CheckoutModule { }
