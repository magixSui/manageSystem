'use strict';
const Router = require("koa-router");
const router = new Router();
const Suggest = require('../../schemas/love/suggestSchema');
/*
 * @desc 查询
 * @url '/community_manage/suggest/save'
 * @params [String] id @desc home id
 * */
router.post('/save', async (ctx) => {
  let _id = ctx.request.body.id;
  let content = ctx.request.body.content;
  const suggest = new Suggest({
    author: _id,
    content: content
  });
  suggest.save();
  ctx.body = {
    code: 200,
    message: 'save succeed.',
    data: null
  };
});

module.exports = router;