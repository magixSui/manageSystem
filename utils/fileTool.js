const fs = require('fs');
const moment = require('moment');
const path = require('path');

function getUploadDirName() {
  // const date = new Date();
  // let month = Number.parseInt(date.getMonth()) + 1;
  // month = month.toString().length > 1 ? month : `0${month}`;
  // const dir = `${date.getFullYear()}${month}${date.getDate()}`;
  // return dir;
  const dir = moment().format("YYYYMMDD");
  return dir;
}

// 一层检查
function checkDirExist(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}

// 递归创建目录 同步方法
function mkdirSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

// 递归创建目录 异步方法  
function mkdirAsync(dirname, callback) {
  fs.exists(dirname, (exists) => {
    if (exists) {
      callback();
    } else {
      mkdirAsync(path.dirname(dirname), function () {
        fs.mkdir(dirname, callback);
      });
    }
  });
}

function checkMimeType(type) {
  let mimetype = ''
  if (type.indexOf('video') > -1) {
    mimetype = 'video'
  }
  if (type.indexOf('audio') > -1) {
    mimetype = 'audio'
  }
  if (type.indexOf('image') > -1) {
    mimetype = 'image'
  }
  return mimetype;
}
function getUploadFileExt(name) {
  let ext = name.split('.');
  return ext[ext.length - 1];
}

function handleFileName(str) {
  // const fileFormat = str.split("."),
  //       ext = fileFormat[fileFormat.length - 1],
  //       originalname = fileFormat.slice(0,-1).join(".");
  //       console.log(ext)
  // return `${moment().format("YYYYMMDD")}-${originalname}-${Math.random().toString(36).substr(2,6)}.${ext}`;
  const fileFormat = str.split("."),
    ext = fileFormat[fileFormat.length - 1];
  return `${Date.now()}-${Math.random().toString(36).substr(2,6)}.${ext}`;
}

module.exports = {
  getUploadDirName, checkDirExist, getUploadFileExt, mkdirSync, checkMimeType, handleFileName, mkdirAsync
};
