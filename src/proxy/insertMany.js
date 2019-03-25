const mongoose = require('mongoose')
const PromiseWrapper = require('../promise-wrapper')
const insertMany = mongoose.Model.insertMany

mongoose.Model.insertMany = function () {
    return new PromiseWrapper(this, arguments, function (session, args) {
        if (args.length === 1) {
            args.push({ session })
        } else if (args.length === 2) {
            args[1]['session'] = session
        }
        return args
    }, insertMany)
}
