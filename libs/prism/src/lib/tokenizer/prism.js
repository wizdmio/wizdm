/**
 * @module PrismJS proxy for Angular
 * @version 0.0.1
 * @author Lucio Francisco
 * @description Forces PrismJS to work in manual mode
 */

(function(global){
  'use strict';
  // Forces prism to run in manual mode
  global.Prism = (global.Prism || {});
  global.Prism.manual = true;
  // Requires Prism safely now
  const prism = require('prismjs');
  // Exports the module
	module.exports = { 
    prism
  };
  
}(window));