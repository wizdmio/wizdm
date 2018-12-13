'use strict'

var unified = require('unified')
var parse = require('remark-parse')
var align = require('remark-align')
var subsup  = require('remark-sub-super')

const options = { 
  commonmark : true,
  pedantic   : true,
  footnotes  : true
};

module.exports = unified()
  .use(parse, options)
  .use(align)
  .use(subsup)
  .freeze()