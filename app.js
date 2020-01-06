const Koa = require('koa');
const http = require('http');
const https = require('https');
const fs = require('fs');
const config = require('./config');
const staticServer = require('koa-static');
var koaBody = require("koa-body");
const Router = require('./router');
const cors = require('@koa/cors');
const mongoose = require('mongoose');
const app = new Koa();

mongoose.connect('mongodb://' + config.mongodb + '/mortage',{useNewUrlParser:true})
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false)

app.use(staticServer(__dirname + '/public'));

app.use(koaBody());
Router(app);
app.use(cors());

// app.listen(config.port,()=>{
//  console.log(chalk.cyan('Server is running at port:' + config.port))
// });

// SSL options
var options = {
    key: fs.readFileSync('./ssl/2_www.magix.xyz.key'),  //ssl文件路径
    cert: fs.readFileSync('./ssl/1_www.magix.xyz_bundle.crt')  //ssl文件路径
};

if (process.env.NODE_ENV === 'production') {
  http.createServer(app.callback()).listen(80);
  https.createServer(options, app.callback()).listen(443);
} else {
  http.createServer(app.callback()).listen(config.port);
}

