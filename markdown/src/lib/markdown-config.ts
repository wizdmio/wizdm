import { InjectionToken } from '@angular/core';
 
export interface MarkdownConfig {
  // From remark-parse @see {https://github.com/remarkjs/remark/tree/master/packages/remark-parse}
  gfm?        : boolean; // Github Flowered Markdown mode (default: true)
  commonmark? : boolean; // Commonmark mode (default: false)
  footnotes?  : boolean; // Enable footnotes (default: false)
};

export const mdConfigToken = new InjectionToken<MarkdownConfig>('wizdm-markdown-config-token');
