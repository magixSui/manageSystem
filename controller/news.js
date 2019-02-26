'use strict';
const mongoose = require('mongoose');
const Router = require("koa-router");
const router = new Router();
const News = require('../schemas/newsSchema');
const User = require('../schemas/userSchema');
// 创建资讯
/*
 * * @desc 保存
 * @url '/community_manage/news/save'
 * @params [String] title @desc 标题
 * @params [String] sub @desc 副标题
 * @params [Array] images @desc 图片
 * @params [String] content @desc 正文
 * @params [String] type @desc 资讯类型
 * @params [String] user @desc 用户Oid
 * */
router.post('/save', async(ctx) => {
  let title = ctx.request.body.title
  let sub = ctx.request.body.sub
  let images = ctx.request.body.images
  let content = ctx.request.body.content
  let type = ctx.request.body.type
  let userId = ctx.request.body.userId
  let newsId = ctx.request.body._id
  if(newsId) {
    const news = await News.findOneAndUpdate({_id:newsId},
    {
      title : title,
      sub : sub,
      images : images,
      content : content,
      type : type
    },      
    {new:true})
    if(news) {
      ctx.body = {
        code: 200,
        message: '保存成功',
        data: {
            news:news
          }
        }
    }
  }else {
    const news = new News({
      title : title,
      sub : sub,
      images : images,
      content : content,
      type : type,
      user: userId
    })
    news.save()
    const user = await User.findOne({_id:userId}).exec()
    user.dynamic.push(news)
    user.save()
    ctx.body = {
    code: 200,
    message: '创建成功',
    data: {
        success:true
      }
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
  let count = Number(ctx.request.query.count)
  let index = Number(ctx.request.query.index)*count
  let news = ''
  let length = await News.count()
  if(type) {
    news = await News.find({type:type},{},{news:true}).skip(index).limit(count).populate('user').exec()
  }else {
    news = await News.find({},{},{news:true}).skip(index).limit(count).populate('user').exec()
  }
  
  ctx.body = {
    code: 200,
    message: '创建成功',
    data: {
      news:news,
      length:length
    }
  }
})
// 删除资讯
/*
 * * @desc 删除
 * @url '/community_manage/news/delete'
 * @params [String] _id @desc _id
 * */
router.post('/delete', async(ctx) => {
  let _id = ctx.request.body._id
  console.log(_id)
  let  news = await News.findByIdAndDelete({_id:_id})
  if(news) {
    const user = await User.findOne({_id:news.user._id}).exec()
    let i = ''
    user.dynamic.forEach((item,index)=>{
      if(item === _id) {
        i = index
      }
    })
    user.dynamic.splice(i,1)
    user.save()
    ctx.body = {
    code: 200,
    message: '删除成功',
    data: {
        success:true
      }
    }
  }
  
})
module.exports = router;