'use strict';
const mongoose = require('mongoose');
const Router = require("koa-router");
const router = new Router();
const Workflow = require('../schemas/workflowSchema');
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
  let content = ctx.request.body.content
  let _id = ctx.request.body._id
  if(_id) {
    const workflow = await Workflow.findOneAndUpdate({_id:_id, content: content})
    
    if(workflow) {
      ctx.body = {
        code: 200,
        message: '保存成功',
        data: {
            workflow:workflow
          }
        }
    }
  }else {
    const workflow = new Workflow({
      content : content
    })
    workflow.save()
    console.log(workflow)
    ctx.body = {
    code: 200,
    message: '创建成功',
    data: {
        workflow:workflow
      }
    }
  }
})
// 查询详情
/*
 * * @desc 详情
 * @url '/community_manage/workflow/searchById'
 * @params [String] _id @desc 资讯id
 * */
router.get('/searchById', async(ctx) => {
  let _id = ctx.request.query._id
  let workflow = await Workflow.findOne({_id:_id}).exec()
  
  ctx.body = {
    code: 200,
    message: '查询成功',
    data: workflow
  }
})
/*
* @desc 构建的表单数据列表
* @url '/community_manage/workflow/list'
* @params [String] count @desc 每组条数
* @params [Number] index @desc 第几组
*/ 
router.get('/list', async(ctx) => {
  let count = Number(ctx.request.query.count);
  let index = Number(ctx.request.query.index)*count;
  let workflow = await Workflow.find().skip(index).limit(count).exec()
  if (workflow) {
    ctx.body = {
      code: 200,
      message: 'list succeed.',
      data: workflow 
    };
  }
});

router.get('/searchComponent', async(ctx) => {
  ctx.body = {
    code: 200,
    message: '查询成功',
    data: [{
      name: 'sd-field',
      show: true,
      label: '表单域',
      type: 0, // 0 基本 1 高级
      icon: 'icon-danhangshurukuang'
    },{
      name: 'sd-button',
      show: true,
      label: '按钮',
      type: 0, // 0 基本 1 高级
      icon: 'icon-anniuzu'
    },{
      name: 'sd-text',
      show: false,
      label: '文本',
      type: 0, // 0 基本 1 高级
      icon: 'icon-label'
    }]
  }
})

module.exports = router;