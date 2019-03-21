'use strict';
//const mongoose = require('mongoose')
const Router = require("koa-router");
const createToken = require("../token/createToken");
const router = new Router();
const User = require('../schemas/userSchema');
const Type = require('../schemas/typeSchema');

// 创建账号
/*
 * * @desc 注册
 * @url '/community_manage/create'
 * @params [String] username @desc 账号
 * @params [String] password @desc 密码
 * */
var type = Type({
  value:'0',
  name:'超级管理员'
})
  User.findOne({
    username: 'admin'
  }).exec((err,admin)=>{
    if(!admin) {
      const user = new User({
      username: 'admin',
      password: '111111',
      nickname: '超级管理员',
      phoneNumber:'',
      avatar: '/upload/image/avatar.png',
      type: '0',
      statu: '0'
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
        phoneNumber:'',
        avatar: '/upload/image/avatar.png',
        dynamic: [],
        type: '2',
        statu: '1',
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
 * @desc 登录
 * @url '/community_manage/admin_login'
 * @params [String] username @desc 账号
 * @params [String] password @desc 密码
 * */
router.post('/admin_login', async(ctx) => {
const {username,password} = ctx.request.body
let exist = await User.findOne({
  username:username,
  password:password,
  type:{$in:['0','1']}
}).exec()
if(!exist) {
  ctx.body = {
    code:503,
    message: '账号或密码错误'
  }
}else {
  let token = createToken();
  ctx.body = {
    code:200,
    message: 'success',
    data: exist,
    token:token
  }
}
})

/*
 * @desc 移动端登录
 * @url '/community_manage/login'
 * @params [String] username @desc 账号
 * @params [String] password @desc 密码
 * */
router.post('/login', async(ctx) => {
const {username,password} = ctx.request.body
let exist = await User.findOne({
  username:username,
  password:password
}).populate('house').exec()
if(!exist) {
  ctx.body = {
    code:503,
    message: '账号或密码错误'
  }
}else {
  let token = createToken();
  ctx.body = {
    code:200,
    message: 'success',
    data: exist,
    token:token
  }
}
})
/*
 * @desc 查询
 * @url '/community_manage/search'
 * @params [String] pagesize @desc 条数
 * @params [String] pagenum @desc 第几组
 * @params [String] type @desc 用户类型
 * */
router.get('/search', async(ctx) => {
let {count,index,type} = ctx.request.query
let length = 0
let users = '';
if(type === '0' || type === '1') {
  length = await User.find({type:{$in:['1','2']}}).countDocuments()
  users = await User.find({type:{$in:['1','2']}}).skip(index).limit(count).exec()
}else if(type === '2') {
  length = await User.find({type:{$in:['2']}}).countDocuments()
  users = await User.find({type:{$in:['2']}}).skip(index).limit(count).exec()
}
  ctx.body = {
    code:200,
    message: 'success',
    data: {
      users:users
    }
  }
})
/*
 * @desc 修改
 * @url '/community_manage/search'
 * @params [String] pagesize @desc 条数
 * @params [String] pagenum @desc 第几组
 * @params [String] type @desc 用户类型
 * */
router.post('/update', async(ctx) => {
const {username,nickname,car,house} = ctx.request.body
let user = '';
user = await User.findOneAndUpdate({username:username},{nickname:nickname,car:car,house:house},{new:true})
user.save()
  if(user) {
      ctx.body = {
      code:200,
      message: 'success',
      data: {
        user:user
      }
    }
  }
})
/*
 * @desc 修改密码
 * @url '/community_manage/reset_pass'
 * @params [String] old_pass @desc 旧密码
 * @params [String] new_pass @desc 新密码
 * @params [String] new_repass @desc 新密码
 * */
router.post('/reset_pass', async(ctx) => {
const {username,old_pass,new_pass,new_repass} = ctx.request.body
let user = '';
if(new_pass === new_repass) {
  user = await User.findOneAndUpdate({username:username},{password:new_pass},{new:true})
  user.save()
  if(user) {
      ctx.body = {
      code:200,
      message: 'success',
      data: {
        user:user
      }
    }
  }else {
    ctx.body = {
      code:506,
      message: '用户不存在',
      data: {
        user:user
      }
    }
  }
}else {
  if(user) {
      ctx.body = {
      code:505,
      message: '两次密码输入不一致',
      data: {
        user:user
      }
    }
  }
}

  
})
/*
 * @desc 审核用户
 * @url '/community_manage/check'
 * @params [String] username @desc 用户名
 * */
router.post('/check', async(ctx) => {
const {username} = ctx.request.body
let user = await User.findOneAndUpdate({username:username},{statu:'2'})
if(user) {
  ctx.body = {
    code:200,
    message: '审核通过',
    data: {
      success:true
    }
  }
}
})
/*
 * @desc 修改权限
 * @url '/community_manage/changeAuth'
 * @params [String] username @desc 用户名
 * */
router.post('/changeAuth', async(ctx) => {
const {username,type} = ctx.request.body
console.log(username)
let user = await User.findOneAndUpdate({username:username},{type:type})
if(user) {
  ctx.body = {
    code:200,
    message: '审核通过',
    data: {
      success:true
    }
  }
}
})
/*
 * @desc 删除用户
 * @url '/community_manage/user/delete'
 * @params [String] username @desc 用户名
 * */
router.post('/delete', async(ctx) => {
let _id = ctx.request.body
  let  user = await User.findByIdAndDelete({_id:_id})
  if(user) {
    ctx.body = {
    code: 200,
    message: '删除成功',
    data: {
        success:true
      }
    }
  }else {
    ctx.body = {
    code: 508,
    message: '用户不存在',
    data: {
        success:'用户不存在'
      }
    }
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