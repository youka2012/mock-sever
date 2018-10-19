module.exports = [
    {
        url: '/action',
        method: 'GET',
        xhrStatus: 200,
        dataType: 'json',
        header: [],
        dataCreator: function (method, paramObj) {
            return {
                code: 2111,
                msg: '成功消息'
            }
        }
    },
]