'use strict';
const mongoose = require('mongoose');
const Router = require("koa-router");
const router = new Router();
const Fix = require('../schemas/fixSchema');
const User = require('../schemas/userSchema');
// 创建资讯
/*
 * * @desc 保存
 * @url '/community_manage/fix/save'
 * @params [String] community @desc 小区
 * @params [String] building @desc 副标题
 * @params [String] unit @desc 图片
 * */
router.post('/save', async(ctx) => {
  let address = ctx.request.body.address
  let phoneNumber = ctx.request.body.phoneNumber
  let truble = ctx.request.body.truble
  let userId = ctx.request.body.userId
  let statu = ctx.request.body.statu
  let fixId = ctx.request.body.fixId || ''
  if(fixId) {
    const fix = await Fix.findOneAndUpdate({_id:fixId},
    {
      address : address,
      phoneNumber : phoneNumber,
      truble : truble,
      statu : statu
    },      
    {new:true})
    ctx.body = {
      code: 200,
      message: '保存成功',
      data: {
        success:true
      }
    }
  }else {
    const fix = new Fix({
      address: address,
      phoneNumber: phoneNumber,
      truble: truble,
      statu:'0',
      user: userId
    })
    fix.save()
    const user = await User.findOne({_id:userId}).exec()
    user.fixs.push(fix)
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
/*
 * * @desc 报修信息列表
 * */
router.get('/list', async(ctx) => {
let count = Number(ctx.request.query.count)
let index = Number(ctx.request.query.index)*count
let length = await Fix.countDocuments()
let fix = await Fix.find({},{},{new:true}).skip(index).limit(count).populate('user').exec()
ctx.body = {
    code: 200,
    message: '查询成功',
    data: {
      fix:fix,
      length:length
    }
}
})
/*
 * * @desc 查询
 * */
//router.get('/search', async(ctx) => {
//let userId = ctx.request.query.userId
//let fix = await fix.findOne({user:userId}).exec()
//if(fix) {
//  ctx.body = {
//    code: 200,
//    message: '查询成功',
//    data: {
//      fix:fix
//    }
//  }
//}else {
//  ctx.body = {
//    code: 505,
//    message: '用户无房产',
//    data: {
//      fix:fix
//    }
//  }
//}
//})
/*
 * * @desc 删除
 * */
router.post('/delete', async(ctx) => {
let ids = ctx.request.body
let fix = await Fix.deleteMany({_id:{$in:ids}}).exec()
if(fix) {
    ctx.body = {
      code: 200,
      message: '删除成功',
      data: {
        fix:fix
      }
    }
}
})
module.exports = router;