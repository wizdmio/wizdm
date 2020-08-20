import { Pipe, PipeTransform } from '@angular/core';

/** Uses the input string as a key to pluck a value from an object. 
 * Dotted separated keys are supoprted to pluck values deeper.
 * @example 'errors.required' | pluck: errorMessages */
@Pipe({ name: 'pluck' })
export class PluckPipe implements PipeTransform {

  transform(key: string, value?: any, defaultValue?: any): any {

    if(!(value instanceof Object) || !key) { return value; }

    return key.split(/[.\/]/).reduce( (value, key) => { 

      return (value[key] !== undefined) ? value[key] : defaultValue;

    }, value);
  }
}

/** Replace keys embedded into the input string withing double brackets 
 * with their corresponding values pluck from the conteext object 
 * @example 'Counting {{ count }}' | interpolate: this */
@Pipe({ name: 'interpolate', pure: false })
export class InterpolatePipe extends PluckPipe {

  transform(value: any, context?: any): string {

    if(typeof value !== 'string') { return value; }
    
    return value.replace(/{{\s*([.\w]+)\s*}}/g, (match, capture) => 
      super.transform(capture, context, capture) );
  }
}

/** Evaluate the expressions embedded into the input string 
 * withing double brackets similarly to eval() with a context limited
 * to the sole variables passed along in the context object 
 * @example 'Double counting {{ count * 2 }}' | eval: this */
@Pipe({ name: 'eval', pure: false })
export class EvalPipe {

  transform(value: any, context?: any): string {
    // Simply return the input as it is when other than string 
    if(typeof value !== 'string') { return value; }
    // Declares intermediate variables 
    let keys: string[], vals: any[];
    // Searches for the expressions within double brackets
    return value.replace(/{{(.*)}}/g, (match, capture) => {
      // Gets context's keys and values
      keys = keys || Object.keys(context);
      vals = vals || keys.map( key => context[key] );
      // Dynamically creates a function with limited scope passing along the 
      // keys as the argument names to be referenced withing the function body,
      // to simply return the evaluated expression value, and calls it. 
      return Function(...keys, `'use strict'; return ${capture};`)(...vals);
    });
  }
}

/** Converts the input string from camelCase to kebab-case*/
@Pipe({ name: 'hyphenize' })
export class HyphenizePipe implements PipeTransform {

  transform(value: any, hyphen: string = '-'): string {

    if(typeof value !== 'string') { return ''; }
    
    return value ? value.replace(/([A-Z])/g, $1 => {
      return hyphen + $1.toLowerCase();
    }): '';
  }
}

/** Converts the input string from kebab-case to camelCase*/
@Pipe({ name: 'camelize' })
export class CamelizePipe implements PipeTransform {

  transform(value: any): string {

    if(typeof value !== 'string') { return ''; }

    return value ? value.replace(/([_.\- ][a-z])/g, $1 => {
      return $1.toUpperCase().replace(/[_.\- ]/g,'');
    }) : '';
  }
}

/** C-like printf() formatting */
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