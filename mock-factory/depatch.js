var url = require('url');
var fs = require('fs');
var path = require('path');
var Mock = require('mockjs');

var dataMap = require('./module-parser');
console.log('dataMap:   ', dataMap)

var mockbase = path.join(__dirname, 'factory');

const CommonHeader = {
    app_josn: {
        key: 'Content-type',
        value: 'application/json;charset=UTF-8',
    },
    text_html: {
        key: 'Content-type',
        value: 'text/html;charset=UTF-8',
    },
    content_languge: {
        key: 'Content-Language',
        value: 'zh-CN',
    }
}

//拼接url作缓存，初步过滤url字段以防止每次对象属性查找带来的额外消耗
var pathLine = '';
for (let i = 0; i < dataMap.length; i++) {
    pathLine = pathLine + ';;' + dataMap[i].url
}

var depatch = function (req, res, next) {
    var urlObj = url.parse(req.url, true),
        method = req.method,
        paramObj = urlObj.query,
        pathName = urlObj.pathname;
    if (pathLine.indexOf(pathName) > -1) {
        dataMap && dataMap.forEach((item, index) => {
            if (item.method === method && item.url===pathName) {
                var resultData;
                if (item.mock) {
                    resultData = Mock.mock(item.response);
                } else {
                    if (item.dataCreator) {
                        resultData = item.dataCreator();
                    } else {
                        resultData = item.response;
                    }
                }!!item.header && !!item.header.length && item.header.forEach(h => res.setHeader(h.key, h.value));
                if (!item.xhrStatus || item.xhrStatus < 300) {
                    switch (item.dataType) {
                        case 'json':
                            res.setHeader(CommonHeader.app_josn.key, CommonHeader.app_josn.value)
                            res.end(JSON.stringify(resultData));
                            break;
                        case 'text':
                            res.setHeader('Content-Language', 'zh-CN');
                            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
                            res.end(resultData);
                            break;
                        case 'attachment':
                            res.setHeader('Content-Language', 'zh-CN');
                            res.setHeader('Content-Type', item.contentType); //'application/x-xls;charset=UTF-8'
                            res.setHeader('Content-Disposition', 'attachment;filename=' + item.fileName ? item.fileName : 'file');
                            res.end(fs.readFileSync(item.filePath))
                            break;
                        case 'stream':
                            res.setHeader('Content-Language', 'zh-CN');
                            res.setHeader('Content-Type', item.contentType); //'application/x-xls;charset=UTF-8'
                            res.end(fs.readFileSync(item.filePath));
                            break;
                        case 'uploader':
                            //TODO
                            //使用multer插件
                            breack;
                        default:
                            res.end();
                            break;
                    }
                } else {
                    res.setHeader(CommonHeader.app_josn.key, CommonHeader.app_josn.value)
                    res.end(JSON.stringify(resultData));
                }
            }
        })
    } else {
        next();
    }
};

function mockMap(res, pathname, paramObj, next) {

    /*  switch (pathname) {
         case '/api/v1/sys/user-menu':
             res.setHeader('Content-Type', 'application/json');
             // res.setHeader('Content-type', 'application/javascript');
             res.end(JSON.stringify(menudata["user-menu"]));
             return;

         case '/sys/home':
             var data = fs.readFileSync(path.join('www/sys/access/', 'home.html'), 'utf-8');
             res.setHeader('Content-Language', 'zh-CN');
             res.setHeader('Content-Type', 'text/html;charset=UTF-8');
             res.end(paramObj.callback + '(' + data + ')');
             return;
         case '/api/apply':
             var data = fs.readFileSync(path.join(mockbase, 'apply.json'), 'utf-8');
             res.setHeader('Content-type', 'application/javascript');
             res.end(paramObj.callback + '(' + data + ')');
             return;
         default:
             ;
     } */
    next();
}

module.exports = depatch;