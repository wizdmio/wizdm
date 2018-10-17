export {};// Ensure this is treated as a module.

declare global {

  interface String {
  /**
   * Trims spaces from both ends of a string
   */
    trim(): string;
  }
}

String.prototype.trim = function(this: string): string {
	return this.replace(/^\s+|\s+$/g,'');
};
