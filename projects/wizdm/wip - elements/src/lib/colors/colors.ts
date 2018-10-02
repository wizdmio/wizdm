import { InjectionToken } from '@angular/core';

export type wmcolor = 'red'|'pink'|'purple'|'deep-purple'|'indigo'|'blue'|'light-blue'|'cyan'|'teal'|'green'|'light-green'|'lime'|'yellow'|'amber'|'orange'|'deep-orange'|'brown'|'grey' |'blue-grey'|'black'|'white'|'none';
export type wmcontrast = 'light' | 'dark';

export interface wmColor {
  color    : wmcolor,
  value    : string,
  contrast : wmcontrast
}

export interface wmColorMap {
  [color: string] : wmColor
}

// Define an injectable token computes the color map accordingly
export const COLOR_MAP = new InjectionToken<wmColorMap>('wmColorMap', {
  providedIn: 'root',
  factory: () => 
    $colors.reduce( (obj, val) => {
      obj[val.color] = val;
      return obj; 
    }, {}) as wmColorMap
});

export const $colors: wmColor[] = [
  { color: 'red'         , value: '#f44336',     contrast: 'light' },
  { color: 'pink'        , value: '#e91e63',     contrast: 'light' },
  { color: 'purple'      , value: '#9c27b0',     contrast: 'light' },
  { color: 'deep-purple' , value: '#673ab7',     contrast: 'light' },
  { color: 'indigo'      , value: '#3949ab',     contrast: 'light' },
  { color: 'blue'        , value: '#2196f3',     contrast: 'light' },
  { color: 'light-blue'  , value: '#03a9f4',     contrast: 'light' },
  { color: 'cyan'        , value: '#00bcd4',     contrast: 'light' },
  { color: 'teal'        , value: '#009688',     contrast: 'light' },
  { color: 'green'       , value: '#4caf50',     contrast: 'dark'  },
  { color: 'light-green' , value: '#8bc34a',     contrast: 'dark'  },
  { color: 'lime'        , value: '#cddc39',     contrast: 'dark'  },
  { color: 'yellow'      , value: '#ffeb3b',     contrast: 'dark'  },
  { color: 'amber'       , value: '#ffc107',     contrast: 'dark'  },
  { color: 'orange'      , value: '#ff9800',     contrast: 'dark'  },
  { color: 'deep-orange' , value: '#ff5722',     contrast: 'light' },
  { color: 'brown'       , value: '#795548',     contrast: 'light' },
  { color: 'grey'        , value: '#9e9e9e',     contrast: 'dark'  },
  { color: 'blue-grey'   , value: '#607d8b',     contrast: 'light' },
  { color: 'none'        , value: 'transparent', contrast: 'dark'  }
];

