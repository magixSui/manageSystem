'use strict';
const mongoose = require('mongoose');
const Router = require("koa-router");
const router = new Router();
const News = require('../schemas/newsSchema');
// 创建资讯
/*
 * * @desc 注册
 * @url '/community_manage/news/create'
 * @params [String] title @desc 标题
 * @params [String] sub @desc 副标题
 * @params [Array] images @desc 图片
 * @params [String] content @desc 正文
 * @params [String] type @desc 资讯类型
 * @params [String] user @desc 用户Oid
 * */
router.post('/create', async(ctx) => {
  let title = ctx.request.body.title
  let sub = ctx.request.body.sub
  let images = ctx.request.body.images
  let content = ctx.request.body.content
  let type = ctx.request.body.type
  let userId = ctx.request.body.userId
  const news = new News({
    title : title,
    sub : sub,
    images : images,
    content : content,
    type : type,
    user: userId
  })
  news.save()

  ctx.body = {
    code: 200,
    message: '创建成功',
    data: {
      success:true
    }
  }
})
// 查询资讯
/*
 * * @desc 注册
 * @url '/community_manage/news/search'
 * @params [String] type @desc 标题
 * */
router.get('/search', async(ctx) => {
  let type = ctx.request.query.type
  News.findOne({type:type},{},{news:true}).populate('user').exec(function(err,news) {
    if(err) {
      
    }else {
      ctx.body = {
        code: 200,
        message: '创建成功',
        data: news
      }
    }
  })
  
})
module.exports = router;