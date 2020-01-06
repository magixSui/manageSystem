'use strict'

const Router = require('koa-router');
const router = new Router({
  prefix: '/mortage'
});
const User = require('../controller/user');
// mortage
const Upfile = require('../controller/uploadBody');
const Car = require('../controller/mortage/cars');
// love app
const Lover = require('../controller/lover');
const Dynamic = require('../controller/dynamic');
const Album = require('../controller/loveController/album');
const Suggest = require('../controller/loveController/suggest');
const Publish = require('../controller/loveController/publish');

const News = require('../controller/news');
const House = require('../controller/house');
const Upload = require('../controller/upload');
const Fix = require('../controller/fix');
const Workflow = require('../controller/workflow');
// 表单设计器
const Component = require('../controller/component');

const r = function(app) {
  
/*
 * router.allowedMethods()作用： 这是官方文档的推荐用法,我们可以
 * 看到 router.allowedMethods()用在了路由匹配 router.routes()之后,所以在当所有
 * 路由中间件最后调用.此时根据 ctx.status 设置 response 响应头 
 */
router.use("/upfile", Upfile.routes());
router.use("/car", Car.routes());



  router.use("/user", User.routes());
  // love app
  router.use("/lover", Lover.routes());
  router.use("/dynamic", Dynamic.routes());
  
  router.use("/album", Album.routes());
  router.use("/suggest", Suggest.routes());
  router.use("/publish", Publish.routes());

  router.use("/news", News.routes());
  router.use("/house", House.routes());
  router.use("/upload", Upload.routes());
  router.use("/fix", Fix.routes());
  router.use("/workflow", Workflow.routes());
  router.use("/component", Component.routes());
  app.use(router.routes()).use(router.allowedMethods());
}

module.exports = r;