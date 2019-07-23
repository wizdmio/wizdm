export {};// Ensure this is treated as a module.

declare global {

    interface String {
    /** 
     * Implements a simple interpolation funtion able to replace named {{variables}} into
     * their corrensponding values. It works at several depth levels {{object.section.value}}
     * recurring into the object down to the value, when available.
     * @param context the object containing the name source values to replace interpolation
     * @returns the same interpolated string 
     * @example "Try {{this}}".interpolate( { this: "that"} ); returns "Try that"
     */
        interpolate(args: any): string;
    }
}

if(typeof String.prototype.interpolate === 'undefined') {

  String.prototype.interpolate = function(this: string, context: any): string {
  // Uses a regular expression to match for {{variableName}} capturing variableName
  // accepting a variable numbers of spaces within the brackets
    return this.replace(/{{\s*([.\w]+)\s*}}/g, (match, capture) => {
      return capture
        .split(".")
        .reduce( (obj, token) => { 
          return obj && obj[token];
        }, context);
      });
  };
}
