const getPinYinBookmark = require('./bookmark');
const debug = require('debug')('index.js');
// const alfy = require('alfy');
const Fuse = require('fuse.js');

const err = console.error;
const bookmarks = getPinYinBookmark();
// err('bookmarks', bookmarks)
const fuse = new Fuse(bookmarks, {
  keys: ['pinyin', 'url']
});

function formatBookmark (bookmark) {
  return {
    title: bookmark.name,
    subtitle: bookmark.url,
    arg: bookmark.url
  };
}
const generateOutputArray = input => fuse.search(input).map(formatBookmark);

const generateOutput = input => {
  err(generateOutputArray(input));
  return JSON.stringify({
    items: generateOutputArray(input)
  });
}

// err('fuse is ', fuse);
const inputStr = process.argv[2];

err('input is', inputStr);

err(process.argv)
err('fuse result', fuse.search(inputStr));
// alfy.output(fuse(inputStr));
console.log(generateOutput(inputStr));

// console.log(JSON.stringify(t2));
// alfy.output(generateOutput(inputStr));