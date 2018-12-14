/**
 * @module reparse
 * @version 0.0.1
 * @author Lucio Francisco
 * @description Hacks the unified/remark node modules to work as a markdown parser in a browser, the parser turns the input text into a MDAST syntaxt tree @see {https://github.com/remarkjs/remark}
 */

(function(global){
	
  // Implements a basic process shim to support vfile/path modules to work in a browser
	if(!!global && !global.process) {
		
		global.process = {
			//env: { DEBUG: undefined },
			cwd: function() { return '/' },
			platform: ''
		}	
	}

  // Imports the useful modules
	var unified = require('unified')
	var parse = require('remark-parse')
	var align = require('remark-align')
	var subsup  = require('remark-sub-super')

  // Defines the parsing options
	const options = { 
	  commonmark : true,
	  pedantic   : true,
	  footnotes  : true
	};

  // Exports the markdown parser including align and subsup plugins
	module.exports = unified()
	  .use(parse, options)
	  .use(align)
	  .use(subsup)
	  .freeze()
  
})(window);