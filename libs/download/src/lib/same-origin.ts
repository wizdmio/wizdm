import { InjectionToken } from '@angular/core';

/** Same Origin regular expression */
export const SAMEORIGIN = new InjectionToken<RegExp>("wizdm.sameorigin.regex", { factory: () => {

  // Test the given URL to start with "data:" or "blob:" or the current hostname
  return new RegExp(`^data:|^blob:|^http(?:s)?:\/\/${(window?.location?.host) || ''}`);

}});