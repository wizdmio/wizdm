import { UrlSegment, UrlMatcher, UrlMatchResult } from '@angular/router';

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