export {};// Ensure this is treated as a module.

declare global {

    interface String {
    /**
     * Implements a simple printf like function with limited support according to the syntax:
     *
     * %[flags][width][.precision]type - where:
     * 
     * flags: can be: 0 to prepend zeroes instead of spaces when width is specified
     * width: is the number of digits
     * precision: is the number of digits after the decimal point
     * type: can be: 'd' for integers, 'f' for fixed point numbers, 's' for strings
     * @example "%% - %d - %2d - %02d - %0.2f - %s".printf( 3.1415, 3.1415, 3.1415, 3.1415, 3.1415 );
     * @returns "% - 3 - <space>3 - 03 - 3.14 - '3.1415'"
     */
        printf(...args: any[]): string;
    }
}

if(typeof String.prototype.printf === 'undefined') {

  String.prototype.printf = function(this: string, ...args: any[]): string {

  let i = 0;

  // Uses a regular expression to match the syntax and capturing the following groups:
  // group1 'flags': ([-+ 0#])? captures 0 or 1 flag among '-', '+', ' ', '0', '#'
  // group2 'width': (\d*)? captures 0 or 1 instance of a number of 1 up digits 
  // group3 'precision': (?:.(\d*))? captures 0 or 1 instance of a number of 1 up digits matching only if prepended by '.'
  // group4 'type': ([%dfs]) matches '%', 'd', 'f' or 's'
  //
  return this.replace(/%([-+ 0#])?(\d*)?(?:.(\d*))?([%dfs])/g, 
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
    });
  };
}