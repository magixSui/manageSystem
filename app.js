const Koa = require('koa');
const http = require('http');
const https = require('https');
const fs = require('fs');
const config = require('./config');
const uris = require('./uris');
const staticServer = require('koa-static');
// const bodyParser = require('koa-bodyparser');
var koaBody = require("koa-body");
const Router = require('./router');
// const chalk = require('chalk');
const cors = require('@koa/cors');
const mongoose = require('mongoose');
// const init = require('./controller/init');
const app = new Koa();

const getMethods = uris.get;
const postMethods = uris.post;


mongoose.connect('mongodb://' + config.mongodb + '/community_management',{useNewUrlParser:true})
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false)
//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function() {
//console.log('success')
//});

app.use(staticServer(__dirname + '/public'));
// app.use(bodyParser({
//     onerror: function (err, ctx) {
//         ctx.throw('body parse error', 422);
//     }
// }));
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
 
// start the server
if (process.env.NODE_ENV === 'development') {
    http.createServer(app.callback()).listen(3000);
}
if (process.env.NODE_ENV === 'production') {
    http.createServer(app.callback()).listen(80);
    https.createServer(options, app.callback()).listen(443);
}

