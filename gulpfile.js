var url = require('url');
var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var gulpif = require('gulp-if'); //条件判断插件 gupif(statement,function)
var minimist = require('minimist'); //命令行解析
var gzip = require('gulp-gzip'); //gzip压缩
var connect = require('gulp-connect'); //server
var proxy = require('http-proxy-middleware'); //反向代理中间件

var mockDepatch = require('./mock-factory/depatch'); //请求分发
var bodyParser = require("body-parser"); //请求体解析
var morgan = require("morgan"); //日志
var del = require('del');//文件删除插件
const serverConfig = require('./server-config');//服务器配置

//引入JWT
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

//引入工具类
// var utils = require("./utils");


var konwnOptions = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'mock'
  }
}
//命令行参数指定服务器环境 mock || proxy 默认mock 使用示例：gulp --env proxy
var envOption = minimist(process.argv.slice(2), konwnOptions);
console.log(envOption.env)
console.log("...Mock sever is starting...");

let options = {
  flags: 'a', // append模式
  encoding: 'utf8', // utf8编码
};

// 添加format方法
Date.prototype.format = function (format) {

  if (!format) {
    format = 'yyyy-MM-dd HH:mm:ss';
  }

  // 用0补齐指定位数
  let padNum = function (value, digits) {
    return Array(digits - value.toString().length + 1).join('0') + value;
  };

  // 指定格式字符
  let cfg = {
    yyyy: this.getFullYear(),
    MM: padNum(this.getMonth() + 1, 2),
    dd: padNum(this.getDate(), 2),
    HH: padNum(this.getHours(), 2),
    mm: padNum(this.getMinutes(), 2),
    ss: padNum(this.getSeconds(), 2),
    fff: padNum(this.getMilliseconds(), 3),
  };

  return format.replace(/([a-z]|[A-Z])(\1)*/ig, function (m) {
    return cfg[m];
  });
}




/* let stdout = fs.createWriteStream('./log/stdout.log', options);
let stderr = fs.createWriteStream('./log/stderr.log', options);
// 创建logger
let logger = new console.Console(stdout, stderr); */
var logDate = new Date();
var logFileName = ''+logDate.getDate() + logDate.getHours() + logDate.getMinutes() + logDate.getSeconds() + '.log';
fs.writeFile('./log/' + logFileName, "", function (err) {
  if(err){
    return console.log(err);
  }
  console.log('Log file is created:  ' + logFileName);
});
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'log', logFileName), {
  flags:'a'
})
//logInFile
var connectMiddleWare;
if (envOption.env === 'proxy') {
  connectMiddleWare = function (connect, opt) {
    return [morgan('short'), morgan("dev", {
          stream: accessLogStream
        }), proxy('/api', {
      target: serverConfig.proxyTargetLoaction,
      changeOrigin: serverConfig.changeOrigin,
    })]
  };
}else{
  connectMiddleWare = function (connect, opt) {
    return [morgan('short'), morgan("dev", {
          stream: accessLogStream
        }), function cors(req, res, next) {
      mockDepatch(req, res, next);
    }]
  }
}

gulp.task('webserver', function () {
  connect.server({
    root: serverConfig.rootDir,
    port: serverConfig.localPort,
    livereload: true,
    middleware: connectMiddleWare
  });
});

gulp.task('cleanlog', function (cb) {
  del([
    // 通配模式来匹配 `log` 文件夹中的所有
    './log/*'
    //不希望删掉这个文件，所以取反匹配模式
    , '!' + logFileName ? logFileName : '1234d31eawe1s4rq22eaqeew1'
  ], cb);
});

gulp.task('reloadConfig', function () {
  // connect.reload();
  gulp.src('./sever-config.js').pipe(connect.reload());
});

gulp.task('reloadMockData', function () {
  // connect.reload();
  gulp.src('./mock-data/**/*.*').pipe(connect.reload());
});

gulp.task('reloadfiles', function () {
  // connect.reload()
  gulp.src('./dist/**/*.*').pipe(connect.reload());
});

gulp.task('watch', function (params) {
  gulp.watch('./dist/**/*.*', ['reloadfiles']);
  gulp.watch('./mock-data/**/*.*', ['reloadMockData']);
  gulp.watch('./sever-config.js', ['reloadConfig']);
})

//多服务器
/* gulp.task('adminsever', function() {
    connect.server({
        root: './admin',
        port: 9009,
        livereload: true
    });
}); */

gulp.task('reload', ['webserver'], function () {
  //刷新web调试服务器
  return gulp.src(['./dist/**/*.*'])
    .pipe(connect.reload());
})

// 默认任务
gulp.task('default', ['webserver', 'watch']);