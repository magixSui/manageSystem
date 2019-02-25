'use strict'

const Router = require('koa-router');
const router = new Router({
  prefix: '/community_manage'
});
const User = require('../controller/user');
const News = require('../controller/news');

const r = function(app) {
  
/*
 * router.allowedMethods()作用： 这是官方文档的推荐用法,我们可以
 * 看到 router.allowedMethods()用在了路由匹配 router.routes()之后,所以在当所有
 * 路由中间件最后调用.此时根据 ctx.status 设置 response 响应头 
 */
  router.use("/user", User.routes());
  router.use("/news", News.routes());
  app.use(router.routes()).use(router.allowedMethods());
}

module.exports = r;