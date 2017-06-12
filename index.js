const getPinYinBookmark = require('./bookmark');
const debug = require('debug')('index.js');
// const alfy = require('alfy');
const Fuse = require('fuse.js');

const bookmarks = getPinYinBookmark();
const fuse = new Fuse(bookmarks, {
  keys: ['pinyin', 'url']
});
debug(fuse);
const inputStr = process.argv[2];

function formatBookmark (bookmark) {
  return {
    title: bookmark.name,
    subtitle: bookmark.url,
    arg: bookmark.url
  };
}
const generateOutputArray = input => fuse.search(input).map(formatBookmark);

const generateOutput = input => {
  return JSON.stringify({
    items: generateOutputArray(input)
  });
}
// alfy.output(fuse(inputStr));
console.log(generateOutput(inputStr));


// console.log(JSON.stringify(t2));
// alfy.output(generateOutput(inputStr));