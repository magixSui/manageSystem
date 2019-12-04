'use strict';
const Router = require("koa-router");
const router = new Router();
const Album = require('../../schemas/albumSchema');
/*
 * @desc 查询
 * @url '/community_manage/album/list'
 * @params [String] id @desc home id
 * */
router.get('/list', async (ctx) => {
  let _id = ctx.request.query.id;
  let album = await Album.find({ home: _id }).exec();
  if (album) {
    ctx.body = {
      code: 200,
      message: 'list success.',
      data: {
        album: album
      }
    }
  }
});
/*
 * @desc 查询
 * @url '/community_manage/album/images'
 * @params [String] id @desc album id
 * */
router.get('/images', async (ctx) => {
  let _id = ctx.request.query.id;
  let album = await Album.findOne({ _id: _id }).exec();
  if (album) {
    ctx.body = {
      code: 200,
      message: 'list success.',
      data: {
        album: album
      }
    }
  }
});

module.exports = router;