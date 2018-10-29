var searchString = 'qqq=1&www=2';
var query = {};
var reg = new RegExp(/([^=&])=(^&$)/g);
searchString.replace(reg, function (full, key, value) {
    if (query[key] === undefined) {
        query[key] = value;
    } else {
        if (Object.prototype.toString.apply(query[key]) === '[object Array]') {
            query[key].push(value);
        } else {
            query[key] = [query[key], value];
        }
    }
})
console.log(query);