// 线上审核使用 更改 type 字段
'use strict';
const Router = require("koa-router");
const router = new Router();
const Publish = require('../../schemas/love/publishSchema.js');
/*
 * @desc 新增
 * @url '/community_manage/publish/save'
 * @params 
 * */
router.get('/save', async (ctx) => {
  const publish = new Publish();
  publish.save();
  ctx.body = {
    code: 200,
    message: 'save succeed.',
    data: null
  };
});

/*
 * @desc 新增
 * @url '/community_manage/publish/save'
 * @params 
 * */
router.get('/search', async (ctx) => {
  const publish = await Publish.findOne({_id: '5d91c123d932516bec023080'}).exec();
  if (publish) {
    ctx.body = {
      code: 200,
      message: 'search succeed.',
      data: publish
    };
  }
});

module.exports = router;