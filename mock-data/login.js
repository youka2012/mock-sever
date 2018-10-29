var fs = require('fs');
var path = require('path');
module.exports = [{
        url: '/api/v1/login',
        method: 'POST',
        xhrStatus: 200,
        dataType: 'json',
        header: [],
        dataCreator: function (method, paramObj) {
            return '登录成功'
        }
    },
    {
        url: '/api/v1/kaptcha',
        method: 'GET',
        xhrStatus: 200,
        dataType: 'stream',
        contentType: 'image/jpeg',
        filePath: './mock-data/kaptcha.jpg',
        header: [{
                key: 'Cache-Control',
                value: 'no-store,no-cache,must-revalidate'
            },
            {
                key: 'Cache-Control',
                value: 'post-check=0,pre-check=0'
            },
            {
                key: 'Pragma',
                value: 'no-cache'
            }
        ],
    },
    {
        url: '/api/v1/pass-change',
        method: 'POST',
        xhrStatus: 200,
        dataType: 'json',
        header: [],
        dataCreator: function (method, paramObj) {
            return '登录成功'
        }
    },
]