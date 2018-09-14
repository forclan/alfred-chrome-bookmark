const debug = require('debug');
const os = require('os');
const fs = require('fs');
const toPinYin = require('./toPinYin');

const exitWithMessage = message => {
    console.log(message);
    process.exit(0);
};

function getBookmarkPath () {
    const LOCATION =
        os.homedir() +
        '/Library/Application Support/Google/Chrome/Default/Bookmarks';
    return LOCATION;
}

function getRawData (path) {
    let rawData;
    try {
        rawData = fs.readFileSync(path);
    } catch (err) {
        exitWithMessage('无法打开相应的文件');
    }
    return rawData;
}

function parseRawData (rawData) {
    let result;
    try {
        result = JSON.parse(rawData);
    } catch (err) {
        exitWithMessage('文件并不是JSON格式');
    }
    return result;
}

function hasChildren (obj) {
    if (obj === null) {
        return false;
    }
    return 'children' in obj;
}

function flatObject (obj) {
    let result = [];
    if ('children' in obj) {
        let children = obj.children;
        result = mapChildrenToArray(children);
        const flatedResult = flatArray(result);
        return flatedResult;
    } else {
        // result.push(obj);
        return obj;
    }
}
function mapChildrenToArray (array) {
    if (array.length === 0 || array === undefined) {
        return [];
    }
    let result = [];
    array.map(val => {
        let data;
        if ('children' in val) {
            data = flatArray(val['children']);
        } else {
            data = val;
        }
        result.push(data);
    });
    return result;
}

function flatArray (array) {
    let result = [];
    array.map(val => {
        if (Array.isArray(val)) {
            result = result.concat(flatArray(val));
        } else {
            result.push(val);
        }
    });
    return result;
}

function formatBookmark (bookmark) {
    // 目前没有找到url之外的类型, 后续添加
    if (bookmark.type === 'url') {
        var obj = {
            url: bookmark.url,
            name: bookmark.name
        };
        str = JSON.stringify(obj);
        return str;
    }
    return null;
}

const getAllBookmarksLog = debug('getAllBookmarks');
function getAllBookmarks (bookmark) {
    // obj 是JSON.parse之后得到的对象
    let roots = bookmark['roots'];
    let result = [];
    const keys = Object.keys(roots);
    getAllBookmarksLog('keys', keys);
    let childObject = keys
        .map(val => roots[val])
        .filter(child => typeof child === 'object');
    childObject.map(val => {
        let re = flatObject(val);
        result = result.concat(re);
    });
    formatedRe = result.map(formatBookmark);
    return formatedRe;
}

const replaceHanZiWithPingYinLog = debug('replaceHanZiWithPingYin');
function replaceHanZiWithPingYin (str) {
    if (str == null) {
        return '';
    }
    const chineseReg = /[\u4e00-\u9fa5]+/g;
    replaceHanZiWithPingYinLog('origin str', str);
    // 如果匹配失败, 返回的结果为null, null没有map方法会产生错误
    const keys = str.match(chineseReg) || [];
    replaceHanZiWithPingYinLog('keys in replaceHanZiWithPingYin', keys);
    const keysPinYin = keys.map(toPinYin);
    replaceHanZiWithPingYinLog(keysPinYin);
    let result = str;
    keys.map((val, i) => {
        result = result.replace(val, keysPinYin[i]);
    });
    return result;
}

const getBookmarkInPinYinLog = debug('getBookmarkInPinYin');
function getBookmarkInPinYin () {
    const path = getBookmarkPath();
    getBookmarkInPinYinLog(path);
    const rawBookmark = getRawData(path);
    getBookmarkInPinYinLog(rawBookmark);
    const jsonBookmark = parseRawData(rawBookmark);
    getBookmarkInPinYinLog(jsonBookmark);
    const allBookmark = getAllBookmarks(jsonBookmark);
    getBookmarkInPinYinLog('allBookmarks', allBookmark);
    pinyinBookmark = allBookmark.map(str => {
        val = JSON.parse(str);
        let pinyin = replaceHanZiWithPingYin(val.name);
        getBookmarkInPinYinLog(
            'pin yin and raw data in getBookmarkInPinYin is',
            pinyin,
            val.name
        );
        let result = JSON.parse(JSON.stringify(val));
        if (pinyin) {
            result.pinyin = pinyin;
        } else {
            result.pinyin = val.name;
        }
        return result;
    });
    return pinyinBookmark;
}

module.exports = getBookmarkInPinYin;
