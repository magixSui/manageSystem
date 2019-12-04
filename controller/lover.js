'use strict';
const Router = require("koa-router");
const createToken = require("../token/createToken");
const router = new Router();
const Lover = require('../schemas/loverSchema');
const Home = require('../schemas/loveHomeSchema');
/*
 * @desc 查询
 * @url '/community_manage/lover/search'
 * @params [String] id @desc Lover id
 * */
router.get('/search', async (ctx) => {
    let _id = ctx.request.query.id;
    let lover = await Lover.findOne({_id: _id}).exec();
    ctx.body = {
        code: 200,
        message: 'search success.',
        data: {
            user: lover
        }
    }
})
// /*
//  * @desc 查看是否绑定过
//  * @url '/community_manage/lover/valid'
//  * @params [String] pagesize @desc 条数
//  * */
// router.get('/valid', async (ctx) => {
//     let _id = ctx.request.query.id;
//     let lover = await Lover.find({_id: _id}).exec();
//     ctx.body = {
//         code: 200,
//         message: 'search success.',
//         data: {
//             user: lover
//         }
//     }
// })
/*
 * @desc 绑定注册
 * @url '/community_manage/lover/save'
 * @params [String] params @desc 微信的 userInfo
 * @params [String] openid @desc 微信的 openid
 * */
router.post('/save', async (ctx) => {
    let params = ctx.request.body;
    let lover = await Lover.findOne({openid: params.openid}).exec();
    if (lover) {
        ctx.body = {
            code: 501,
            message: 'user already exist.',
            data: {
                user: lover
            }
        }
    } else {
        const lover = new Lover(ctx.request.body);
        await lover.save();
        ctx.body = {
            code: 200,
            message: 'create success.',
            data: {
                user: lover
            }
        }
    }
});

/*
 * @desc 绑定情侣
 * @url '/community_manage/lover/bind'
 * @params [String] ObjectId @desc 情侣的 ObjectId
 * */
router.post('/bind', async (ctx) => {
    let idOwn = ctx.request.body.id1;
    let idHis = ctx.request.body.id2;
    // if (idOwn.match(/^[0-9a-fA-F]{24}$/)) {
    //     // Yes, it's a valid ObjectId, proceed with `findById` call.
    // }
    let lover1 = await Lover.findOne({ _id: idOwn }).exec();
    let lover2 = await Lover.findOne({ _id: idHis }).exec();
    // let lovers = await Lover.find({ _id: { $in: [idOwn, idHis] } }).exec();
    if (lover1.home || lover2.home) {
        ctx.body = {
            code: 502,
            message: 'home exist.',
            data: null
        };
    } else if(lover1.companion || lover2.companion) {
        ctx.body = {
            code: 502,
            message: 'companion exist.',
            data: null
        };
    } else {
        //  Maximum call stack size exceeded
        const home = new Home({
            name: '爱的小屋'
        });
        home.members.push(lover1);
        home.members.push(lover2);
        home.save();
        lover1.companion = idHis;
        lover1.home = home;
        lover1.save();
        lover2.companion = idOwn;
        lover2.home = home;
        lover2.save();

        ctx.body = {
            code: 200,
            message: 'bind success.',
            data: {
                user1: lover1,
                user2: lover2
            }
        };
    }
});

module.exports = router;