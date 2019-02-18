'use strict';
//const mongoose = require('mongoose')
const Router = require("koa-router");
const createToken = require("../token/createToken");
const router = new Router();
/*
 * @url '/community_manage/login'
 * @params [String] username @desc 账号
 * @params [String] password @desc 密码
 * */
router.post('/login', async(ctx) => {
const {username,password} = ctx.request.body
//const news = new News({
//  title: title,
//  type: type,
//  author:author,
//  images:images,
//  content:content
//})
//
//await news.save()
let token = createToken();
  ctx.body = {
    code:200,
    message: 'success',
    data: {
      name:'magix'
    },
    token:token
  }
})

/*
 * @url '/community_manage/login'
 * @params [String] username @desc 账号
 * @params [String] password @desc 密码
 * */
router.post('/signout', async(ctx) => {
let token = '';
  ctx.body = {
    code:200,
    message: 'success',
    data: {
      
    },
    token:token
  }
})
module.exports = router;