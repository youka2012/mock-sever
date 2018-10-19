var fs = require('fs');

module.exports = [{
        url: '/',
        method: 'GET',
        xhrStatus: 200,
        dataType: 'text',
        header: [],
        dataCreator: function (method, paramObj) {
            return fs.readFileSync('./dist/index.html', 'utf-8');
        }
    },
    {
        url: '/index',
        method: 'GET',
        xhrStatus: 200,
        dataType: 'text',
        header: [],
        dataCreator: function (method, paramObj) {
            return fs.readFileSync('./dist/index.html', 'utf-8');
        }
    },
    {
        url: '/menu',
        method: 'GET',
        xhrStatus: 200,
        dataType: 'json',
        header: [],
        dataCreator: function (method, paramObj) {
            return {
                code: 2111,
                data: ['成功211']
            }
        }
    },
    {
        url: '/err',
        method: 'GET',
        xhrStatus: 400,
        dataType: 'json',
        header: [],
        dataCreator: function (method, paramObj) {
            return 'not found'
        }
    },
]