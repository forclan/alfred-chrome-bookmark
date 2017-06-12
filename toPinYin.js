const pinyin = require('pinyin');

// https://github.com/hotoo/pinyin
// 设置不带音标
var option = {
  style: pinyin.STYLE_NORMAL
};

const toPinYinArray = str => pinyin(str, option);

const toPinYin = str => toPinYinArray(str).join('') || '';
module.exports = toPinYin;