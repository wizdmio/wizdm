export {};

declare global {

  interface String {
    trim(): string;
    camelize(): string;
    hyphenize(string): string;
  }
}

// Implements a set of string conversion functions between CamelCase and Hypen delimited notations
//
String.prototype.trim = function(this: string): string {
	return this.replace(/^\s+|\s+$/g,'');
};

String.prototype.camelize = function(this: string): string {
	return this.replace(/([_.\- ][a-z])/g, $1 => $1.toUpperCase().replace('-',''));
};

String.prototype.hyphenize = function(this: string, hyphen = '-'): string {
	return this.replace(/([A-Z])/g, $1 => hyphen + $1.toLowerCase());
};
