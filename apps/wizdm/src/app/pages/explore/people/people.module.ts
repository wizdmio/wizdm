import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GtagModule } from '@wizdm/gtag';
import { ReadmeModule } from '@wizdm/readme';
import { IconModule } from '@wizdm/elements/icon';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { HighlightModule } from '@wizdm/elements/highlight';
import { ActionbarModule } from 'app/navigator/actionbar';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { PeopleComponent } from './people.component';

const routes: RoutesWithContent = [{

  path: '',
  content: 'explore/people',
  component: PeopleComponent

}];

@NgModule({
  declarations: [ PeopleComponent ],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    GtagModule,
    ReadmeModule,
    IconModule,
    ButtonChangerModule,
    HighlightModule,
    //ActionbarModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class PeopleModule { }
