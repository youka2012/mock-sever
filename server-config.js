const serverConfig = {
    rootDir:'./dist',
    localPort: 8008,
    proxyTargetLoaction: 'http://127.0.0.1:8989',
    changeOrigin:true
}
module.exports = serverConfig;