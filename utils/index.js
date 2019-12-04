const getUrlFromEditor = require('./getUrlFromEditor');
const getIpAddress = require('./getIpAddress');
const fileTool = require('./fileTool');
module.exports = Object.assign({}, {
  getUrlFromEditor,getIpAddress
}, fileTool);
