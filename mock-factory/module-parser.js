var path = require('path');
var fileExplorer = require('./file-explorer')

var combinedData = [];
var dataRootDir = path.resolve(__dirname, '../mock-data');

//动态引入文件夹内的数据
function loadModule(fileDir) {
    var _data = require(fileDir.substring(0, fileDir.lastIndexOf('.')));
    // _data && Array.prototype.push.apply(combinedData, _data);
    //防重
    if (_data){
        _data.forEach(mdata => {
            if (mdata.url !== undefined) {
                if (!combinedData.some(cdata => cdata.url === mdata.url)) {
                    combinedData.push(mdata);
                }
            }
        })
    }
}

//合并数据
var fileStatsArray = fileExplorer(dataRootDir);
fileStatsArray.forEach(function (item) {
    if (path.extname(item.fileName) === '.js') {
        loadModule(item.filePath);
    }
})

module.exports = combinedData;