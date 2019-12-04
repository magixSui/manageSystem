const Router = require("koa-router");
const r = new Router();
const multer = require('koa-multer');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const config = require('../config');
//const {preUrl} = require('../config')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let mimetype = '' 
    if(file.mimetype.indexOf('video') > -1) {
      mimetype = 'video'
    }
    if(file.mimetype.indexOf('audio') > -1) {
      mimetype = 'audio'
    }
    if(file.mimetype.indexOf('image') > -1) {
      mimetype = 'image'
    }
    const dir = moment().format("YYYYMMDD"),
    _path = `public/uploads/${mimetype}/${dir}`;
    mkdirSync(_path,function() {
      cb(null, _path);
    });
    
  },
  filename: function (req, file, cb) {
    let F_NAME = handleFileName(file.originalname);
    cb(null, F_NAME);
  },
});

const upload = multer({
  storage,
}).any();


var mkdirSync = function(dirpath, callback) {
  fs.exists(dirpath, function(exists) {
    if(exists) {
        callback&&callback();
    } else { 
    //尝试创建父目录，然后再创建当前目录
    mkdirSync(path.dirname(dirpath), function(){
      fs.mkdir(dirpath,callback);
    });
    }
  });
}

function handleFileName(str) {
  const fileFormat = str.split("."),
        ext = fileFormat[fileFormat.length - 1],
        originalname = fileFormat.slice(0,-1).join(".");
  return `${moment().format("YYYYMMDD")}-${originalname}-${Math.random().toString(36).substr(2,6)}.${ext}`;
}

// 上传apk
r.post('/binary', upload, async (ctx) => {
//let urls = []
let urls = ''
  ctx.req.files.forEach((item,index)=>{
    let path = item.path.replace(/^public(\\|\/)/, '')
    urls = (`http://${config.ip}:${config.port}/${path}`.replace(/\\/g,'\/'))
  })
  
  ctx.body = {
    code: 200,
    message: '保存成功',
    data: urls
  }
});

module.exports = r;
