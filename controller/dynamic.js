'use strict';
// const mongoose = require('mongoose');
const Router = require("koa-router");
const router = new Router();
const Dynamic = require('../schemas/dynamicSchema');
const Lover = require('../schemas/loverSchema');
const Home = require('../schemas/loveHomeSchema');
const Album = require('../schemas/albumSchema');
// const utils = require('../utils');

// 查询
/*
 * * @desc 查询
 * @url '/community_manage/dynamic/search'
 * @params [String] _id @desc _id
 * */
router.get('/search', async (ctx) => {
  let id = ctx.request.query.id;
  let count = Number(ctx.request.query.count);
  let index = Number(ctx.request.query.index) * count;
  let length = await Dynamic.find({ home: id }).countDocuments();
  const dynamic = await Dynamic.find({ home: id }, {}, { news: true }).skip(index).limit(count).populate('author').exec();
  if (dynamic) {
    ctx.body = {
      code: 200,
      message: 'find succeed.',
      data: {
        dynamic: dynamic,
        length: length
      }
    }
  }
});

// 查询
/*
 * * @desc 查询
 * @url '/community_manage/dynamic/save'
 * @params [String] authorId @desc 创建者id
 * @params [String] homeId @desc 小屋id
 * */
router.post('/save', async (ctx) => {
  let homeId = ctx.request.body.homeId;
  let authorId = ctx.request.body.authorId;
  let content = ctx.request.body.content;
  let images = ctx.request.body.images;
  const dynamic = new Dynamic({
    author: authorId,
    home: homeId,
    content: content,
    type: 1, // 默认私有
    images: images
  });
  dynamic.save();
  const lover = await Lover.findOne({ _id: authorId }).exec();
  lover.dynamic.push(dynamic);

  const home = await Home.findOne({ _id: homeId }).exec();
  home.dynamic.push(dynamic);

  const album = await Album.findOne({ type: 'system' }).exec();
  if (album) {
    images.forEach(item => {
      album.images.push(item);
    });
    album.save();
  } else {
    const album = new Album({
      author: authorId,
      home: homeId,
      images: images,
      type: 'system',
      name: '系统相册',
      desc: '系统相册'
    });
    album.save();
    lover.album.push(album);
    home.album.push(album);
  }

  lover.save();
  home.save();

  ctx.body = {
    code: 200,
    message: 'save succeed.',
    data: null
  };
});

router.post('/comment', async (ctx) => {
  // TODO 回复评论者
  let authorId = ctx.request.body.authorId;
  let dynamicId = ctx.request.body.dynamicId;
  let content = ctx.request.body.content;
  const dynamic = await Dynamic.findOne({ _id: dynamicId }).exec();

  const author = await Lover.findOne({ _id: authorId }).exec();
  dynamic.comment.push({
    author: author,
    content: content,
    createAt: Date.now()
  });
  dynamic.save();
  ctx.body = {
    code: 200,
    message: 'comment succeed',
    data: null
  };
});

router.post('/delete', async (ctx) => {
  let authorId = ctx.request.body.authorId;
  let homeId = ctx.request.body.homeId;
  let _id = ctx.request.body._id;
  const dynamic = await Dynamic.findByIdAndDelete({ _id: _id });
  console.log(dynamic);
  if (dynamic) {
    const user = await Lover.findOne({ _id: authorId }).exec();
    const home = await Home.findOne({ _id: homeId }).exec();
    let u_i = null,
      h_i = null;
    user.dynamic.forEach((item, index) => {
      if (item === _id) {
        u_i = index;
      }
    });
    user.dynamic.splice(u_i, 1);
    user.save();

    home.dynamic.forEach((item, index) => {
      if (item === _id) {
        h_i = index;
      }
    });
    home.dynamic.splice(h_i, 1);
    home.save();
    ctx.body = {
      code: 200,
      message: '删除成功',
      data: null
    }
  } else {
    ctx.body = {
      code: 902,
      message: 'can not find id.',
      data: null
    }
  }
});

module.exports = router;