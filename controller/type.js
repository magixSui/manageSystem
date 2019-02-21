'use strict';
const Type = require('../schemas/typeSchema');

function create() {
  Type.find().exec(exist=>{
  if(!exist) {
    const type0 = new Type({
      value:'0',
      name:'超级管理员'
    })
    type0.save()
    const type1 = new Type({
      value:'1',
      name:'管理员'
    })
    type1.save()
    const type2 = new Type({
      value:'2',
      name:'用户'
    })
    type2.save()
  }
})
}

module.exports = create()
