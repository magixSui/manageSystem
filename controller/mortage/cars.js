'use strict';
// const mongoose = require('mongoose');
const Router = require("koa-router");
const router = new Router();
const Car = require('../../schemas/mortage/cars');

/*
 * * @desc 新增
 * @url '/mortage/car/save'
 * */
router.post('/save', async (ctx) => {
  let title = ctx.request.body.title;
  let date = ctx.request.body.date;
  let displacement = ctx.request.body.displacement;
  let drive = ctx.request.body.drive;
  let mileage = ctx.request.body.mileage;
  let price = ctx.request.body.price;
  let type = ctx.request.body.type;
  let images = ctx.request.body.images;

  const car = new Car({
    title: title,
    date: date,
    displacement: displacement,
    drive: drive,
    mileage: mileage,
    price: price,
    type: type,
    images: images
  });
  car.save();

  ctx.body = {
    code: 200,
    message: 'save succeed.',
    data: null
  };
});

/*
 * * @desc 列表
 * @url '/mortage/car/list'
 * */
router.get('/list', async (ctx) => {
  let count = Number(ctx.request.query.count);
  let index = Number(ctx.request.query.index)*count;

  let length = await Car.countDocuments();
  let cars = await Car.find({},{}).skip(index).limit(count).exec();
  ctx.body = {
    code: 200,
    message: '查询成功',
    data: {
      cars:cars,
      length:length
    }
  };
});

router.post('/delete', async (ctx) => {
  let ids = ctx.request.body.ids;
  console.log(ids)
  const cars = await Car.deleteMany({ _id: { $in: ids } });
  if (cars) {
    ctx.body = {
      code: 200,
      message: 'delete success.',
      data: null
    }
  }
});
module.exports = router;