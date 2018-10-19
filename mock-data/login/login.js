module.exports = [
    {
        url: '/login',
        method: 'POST',
        xhrStatus: 200,
        dataType: 'json',
        header: [],
        dataCreator: function (method, paramObj) {
            return {
                code: 200,
                msg: '成功消息22'
            }
        }
    }
]