'use strict';
//const mongoose = require('mongoose')
const Router = require("koa-router");
const createToken = require("../token/createToken");
const router = new Router();
const User = require('../schemas/userSchema');

// 创建账号
/*
 * @url '/community_manage/create'
 * @params [String] username @desc 账号
 * @params [String] password @desc 密码
 * */
  User.findOne({
    username: 'admin'
  }).exec((err,admin)=>{
    if(!admin) {
      const user = new User({
      username: 'admin',
      password: '111111',
      nickname: '超级管理员',
      avatar: '/avatar.jpg',
      dynamic: [],
      followers: [],
      watchers:[],
      car:{},
      house:{},
      bill:{}
    })
    user.save()
    }
  });
router.post('/create', async(ctx) => {
  let username = ctx.request.body.username
  let password = ctx.request.body.password
  let pass = ctx.request.body.pass
  let exist = await User.findOne({
    username: username
  }).exec();
  if(!exist) {
    if(password === pass) {
        const user = new User({
        username: username,
        password: password,
        nickname: username,
        avatar: '/avatar.jpg',
        dynamic: [],
        followers: [],
        watchers:[],
        car:{},
        house:{},
        bill:{}
      })
      await user.save()
      
      ctx.body = {
        code: 200,
        message:'注册成功',
        data: {}
      }
    }else {
      ctx.body = {
        code: 502,
        message:'密码输入不一致',
        data: {}
      }
    }
  } else {
    ctx.body = {
      code: 501,
      message:'用户已存在'
    }
  }
})
/*
 * @url '/community_manage/login'
 * @params [String] username @desc 账号
 * @params [String] password @desc 密码
 * */
router.post('/login', async(ctx) => {
const {username,password} = ctx.request.body
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