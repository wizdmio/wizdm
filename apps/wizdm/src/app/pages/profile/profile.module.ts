import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlSegment, UrlMatcher, UrlMatchResult } from '@angular/router';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { ProfileService } from './profile.service';
import { ProfileComponent } from './profile.component';

export function matchUserNameOnly(url: UrlSegment[]): UrlMatchResult {
  // Matches a single segment only
  if(url.length !== 1) { return null; }
  // A username starts with @
  const match = url[0].path.match(/^@([\w-]+)/);
  // Process the match
  return match ? ({
    // Returns the userName as a param
    posParams: { userName: { ...url[0], path: match[1] } as UrlSegment },
    // Consumes the url segment
    consumed: url
  // Assumes no heading @ means browsing for a User ID 
  }) : null;
}

export function matchUserNameOrId(url: UrlSegment[]): UrlMatchResult {
  // Matches a single segment only
  if(url.length !== 1) { return null; }
  // A username starts with @
  const match = matchUserNameOnly(url);
  // Process the match
  return match || (url[0].path.length > 0 ? ({
    // Returns the userId as a param
    posParams: { userId: url[0] },
    // Consumes the url segment
    consumed: url
  // Aborts when empty
  }) : null);
}

const routes: RoutesWithContent = [
  {
    path: '',
    content: '',
    component: ProfileComponent,
    canActivate: [ ProfileService ]
  }
];

@NgModule({
  declarations: [ ProfileComponent ],
  imports: [
    CommonModule,
    ContentRouterModule.forChild(routes)
  ],
  providers: [ ProfileService ]
})
export class ProfileModule { }
