import { UrlSegment, UrlMatchResult } from '@angular/router';

/** Static content route matcher */
export function matchFullPath(url: UrlSegment[]): UrlMatchResult {

  // Builds the posParams from the url sub segments
  const posParams = url.reduce( (params, url, index) => {

    params[`path${index}`] = url;
    return params;

  }, {});

  // Matches all the routes passing along the sub segments as pos parameters
  return { consumed: url, posParams };
}