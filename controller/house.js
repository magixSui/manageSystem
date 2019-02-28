'use strict';
const mongoose = require('mongoose');
const Router = require("koa-router");
const router = new Router();
const House = require('../schemas/houseSchema');
// 创建资讯
/*
 * * @desc 保存
 * @url '/community_manage/house/save'
 * @params [String] community @desc 小区
 * @params [String] building @desc 副标题
 * @params [String] unit @desc 图片
 * @params [String] room @desc 正文
 * @params [String] userId @desc 用户Oid
 * */
router.post('/save', async(ctx) => {
  let community = ctx.request.body.community
  let building = ctx.request.body.building
  let unit = ctx.request.body.unit
  let room = ctx.request.body.room
  let numbered = ctx.request.body.numbered
  let userId = ctx.request.body.userId
  let exist = await House.findOne({numbered:numbered}).exec()
  console.log(exist)
  if(exist) {
    ctx.body = {
    code: 505,
    message: '房屋已存在'
    }
  }else {
    let house = new House({
      community: community,
      building: building,
      unit: unit,
      room: room,
      numbered: numbered,
      user: userId
    })
    house.save()
    ctx.body = {
    code: 200,
    message: '创建成功',
    data: {
      success:true
    }
    }
  }
})
// 房屋信心列表
/*
 * * @desc 保存
 * */
router.get('/list', async(ctx) => {
  let house = await House.find({},{},{new:true}).populate('user').exec()
  ctx.body = {
    code: 200,
    message: '查询成功',
    data: {
      house:house
    }
  }
})
module.exports = router;