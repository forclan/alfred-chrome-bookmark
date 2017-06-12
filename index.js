const getPinYinBookmark = require('./bookmark');
const debug = require('debug')('index.js');
const alfy = require('alfy');
const Fuse = require('fuse.js');

const bookmarks = getPinYinBookmark();
const fuse = new Fuse(bookmarks, {
  keys: ['pinyin', 'url']
})
const inputStr = process.argv[2];

alfy.output(fuse(inputStr));
