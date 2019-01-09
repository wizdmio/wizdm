export {};

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

String.prototype.select = function(this: string, context: any, defaults?: any): any {
    
  return this.split(".").reduce( (value, token) => {
      return (value && value[token]) || defaults;
    }, context);
}
