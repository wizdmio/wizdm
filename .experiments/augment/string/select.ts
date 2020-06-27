export {};// Ensure this is treated as a module.

declare global {

  interface String {
  /**
   * Implements a simple child property selection function by recurring into the context object
   * searching for the child property described by the comma delimited string itself
   * @param context the object containing the properties to search for
   * @param defaults an optional object which properties to be returned when missing in context
   * @example let content = myMap.select("children.values");
   * @returns an object containing the requested values
   */
    select(context: any, defaults?: any): any;
  }
}

if(typeof String.prototype.select === 'undefined') {

  String.prototype.select = function(this: string, context: any, defaults?: any): any {
      
    return this.split(".").reduce( (value, token) => {
        
      if(token === '') { return value; }

      return (value && value[token]) || defaults;

    }, context);
  };
}
