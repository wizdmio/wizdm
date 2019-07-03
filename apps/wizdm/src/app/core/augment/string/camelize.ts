export {};// Ensure this is treated as a module.

declare global {

  interface String {
  /**
   * Turns an Hyphen delimited string into a CamelCase version of it
   * @example "invalid-user".camelize();
   * @returns "InvalidUser"
   */
    camelize(): string;
  }
}

if(typeof String.prototype.camelize === 'undefined') {

  String.prototype.camelize = function(this: string): string {
    return this.replace(/([_.\- ][a-z])/g, $1 => {
      return $1.toUpperCase().replace(/[_.\- ]/g,'');
    });
  };
}
