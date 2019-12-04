'use strict';
const mongoose = require('mongoose');
const Router = require("koa-router");
const router = new Router();
const Component = require('../schemas/componentSchema');
const utils = require('../utils');
/*
 * * @desc 批量保存
 * @url '/community_manage/component/insertmany'
 * @params [String] title @desc 标题
 * */
router.post('/insertmany', async(ctx) => {
  let componentArray = ctx.request.body.components;
  const result = await Component.insertMany(componentArray);
  if (result) {
    ctx.body = {
        code: 200,
        message: '保存成功',
        data: {
          components: result
        }
    }
  }
});
// 创建资讯
/*
 * * @desc 保存
 * @url '/community_manage/component/save'
 * @params [String] title @desc 标题
 * */
router.post('/save', async(ctx) => {
  let title = ctx.request.body.title
  let componentId = ctx.request.body._id
  
  if(componentId) {
    const component = await Component.findOneAndUpdate({_id:componentId},
    {
      title : title
    },      
    {new:true})
    if(component) {
      ctx.body = {
        code: 200,
        message: '保存成功',
        data: {
          data: component
        }
        }
    }
  }else {
    const component = new Component({
      title : title,
    })
    component.save()
//  const user = await User.findOne({_id:userId}).exec()
//  user.dynamic.push(news)
//  user.save()
    ctx.body = {
    code: 200,
    message: 'create succeed.',
    data: {
        success:true
      }
    }
  }
})
// 查询资讯
/*
 * * @desc 列表
 * @url '/community_manage/component/list'
 * @params [String] type @desc 标题
 * */
router.get('/list', async(ctx) => {
  let searchConditions = {};
//let type = ctx.request.query.type
let count = Number(ctx.request.query.count);
let index = Number(ctx.request.query.index)*count;
//let userId = ctx.request.query.userId
//let news = ''
let length = 0;
//if(userId) {
//  searchConditions.user = userId
//}
//if(type) {
//  searchConditions.type = type
//}
  length = await Component.find(searchConditions).countDocuments();
  let components = await Component.find(searchConditions,{},{news:true}).skip(index).limit(count).exec();
  
  ctx.body = {
    code: 200,
    message: 'find succeed.',
    data: {
      components: components,
      length:length
    }
  }
})

router.post('/edit', async(ctx) => {
  let { label, show, icon, type, _id } = ctx.request.body;
  const component = await Component.findOneAndUpdate({_id: _id},
     {
       label:label,
       show: Boolean(show),
       icon: icon,
       type: Number(type)
      }, {}).exec();
  if (component) {
    ctx.body = {
      code: 200,
      message: 'edit succeed.',
      data: {
        component: component
      }
    };
  } else {
    ctx.body = {
      code: 900,
      message: 'component is not exist.',
      data: null
    };
  }
});

router.post('/editProp', async(ctx) => {
  let { _id, props } = ctx.request.body;
  let component = await Component.findOneAndUpdate({_id: _id}, {
    props: props
  }).exec();

  if (component) {
    ctx.body = {
      code: 200,
      message: 'edit succeed.',
      data: {
        component: component
      }
    };
  } else {
    ctx.body = {
      code: 900,
      message: 'component is not exist.',
      data: null
    };
  }
});
module.exports = router;