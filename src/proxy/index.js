const fs = require('fs')
const path = require('path')
const proxys = fs.readdirSync(__dirname)

proxys.forEach((proxy) => {
    if (proxy === 'index.js') return
    require(path.join(__dirname, proxy))
})

