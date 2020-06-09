import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pluck' })
export class PluckPipe implements PipeTransform {

  transform(value: any, key?: string, defaultValue?: any): any {

    if(!(value instanceof Object) || !key) { return value || defaultValue; }

    return key.split(/[.\/]/).reduce( (obj, token) => { 
      return obj && obj[token];
    }, value) || defaultValue;
  }
}

@Pipe({ name: 'interpolate' })
export class InterpolatePipe extends PluckPipe {

  transform(value: any, context?: any): string {

    if(typeof value !== 'string') { return ''; }
    
    return value ? value.replace(/{{\s*([.\w]+)\s*}}/g, (match, capture) => 
      super.transform(context, capture, match) ) : '';
  }
}

@Pipe({ name: 'hyphenize' })
export class HyphenizePipe implements PipeTransform {

  transform(value: any, hyphen: string = '-'): string {

    if(typeof value !== 'string') { return ''; }
    
    return value ? value.replace(/([A-Z])/g, $1 => {
      return hyphen + $1.toLowerCase();
    }): '';
  }
}

@Pipe({ name: 'camelize' })
export class CamelizePipe implements PipeTransform {

  transform(value: any): string {

    if(typeof value !== 'string') { return ''; }

    return value ? value.replace(/([_.\- ][a-z])/g, $1 => {
      return $1.toUpperCase().replace(/[_.\- ]/g,'');
    }) : '';
  }
}

@Pipe({ name: 'printf' })
export class PrintfPipe implements PipeTransform {

  transform(value: any, ...args: any): string {

    if(typeof value !== 'string') { return ''; }

    let i = 0;
    // Uses a regular expression to match the syntax and capturing the following groups:
    // group1 'flags': ([-+ 0#])? captures 0 or 1 flag among '-', '+', ' ', '0', '#'
    // group2 'width': (\d*)? captures 0 or 1 instance of a number of 1 up digits 
    // group3 'precision': (?:.(\d*))? captures 0 or 1 instance of a number of 1 up digits matching only if prepended by '.'
    // group4 'type': ([%dfs]) matches '%', 'd', 'f' or 's'
    //
    return value ? value.replace(/%([-+ 0#])?(\d*)?(?:.(\d*))?([%dfs])/g, 
      (match, flags, width, precision, type) => {

      //console.log("sprintf: " + match +"," + flags + "," + width + "," + precision + "," + type);

      let value = args[i++];
      let out = match;

      switch(type) {
        
        case 'd': {

        // Turns the value into an integer
        out = new Number(value).toFixed(0);

        // Prepend '0' or ' ' depending on flags & width values
        if(typeof width !== "undefined" && width > out.length){
            out = (flags === '0' ? "0" : " ").repeat(width - out.length) + out;}
        }
        break;

        case 'f': {

        // Turns the value into a fixed number, in case precision is "undefined" toFixed returs all the digits
        out = new Number(value).toFixed(precision);

        // Evaluates the number of integer digits
        let digits = out.split('.')[0].toString().length;

        // Prepend '0' or ' ' depending on flags & width values
        if(typeof width !== "undefined" && width > digits){
            out = (flags === '0' ? "0" : " ").repeat(width - digits) + out;}
        }
        break;
        
        case 's':
        out = value.toString();
        break;

        case '%':// Step back, theres' no assosiated arg 
        out = "%";
        i--; 
        break;
      }

      return out;
    }) : '';
  };
}