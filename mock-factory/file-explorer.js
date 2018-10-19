var fs = require('fs');
var path = require('path');
//查询文件夹内的所有js文件
module.exports = function getFiles(fileDir, _resultFileStatArray) {
    var resultFileStatArray = _resultFileStatArray || [];
    //同步读取
    fs.readdirSync(fileDir).forEach(fileName => {
        var filePath = path.join(fileDir, fileName);
        //同步解析
        var stats = fs.statSync(filePath);
        if (stats.isFile()) {
            resultFileStatArray.push({
                fileName,
                fileDir,
                filePath
            });
        } else if (stats.isDirectory()) {
            getFiles(filePath, resultFileStatArray);
        }
    });
    return resultFileStatArray;
}