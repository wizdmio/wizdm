export {};

declare global {

  interface String {
  /**
   * Trims spaces from both ends of a string
   */
    trim(): string;

  /**
   * Turns an Hyphen delimited string into a CamelCase version of it
   * @example "invalid-user".camelize();
   * @returns "InvalidUser"
   */
    camelize(): string;

  /**
   * Turns a CamelCase string into an Hyphen delimited version of it
   * @example "wrongParrword".hyphenize();
   * @returns "wrong-password"
   */
    hyphenize(string): string;
  }
}

String.prototype.trim = function(this: string): string {
	return this.replace(/^\s+|\s+$/g,'');
};

String.prototype.camelize = function(this: string): string {
	return this.replace(/([_.\- ][a-z])/g, $1 => $1.toUpperCase().replace('-',''));
};

String.prototype.hyphenize = function(this: string, hyphen = '-'): string {
	return this.replace(/([A-Z])/g, $1 => hyphen + $1.toLowerCase());
};
