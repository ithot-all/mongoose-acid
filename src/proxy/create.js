const mongoose = require('mongoose')
const PromiseWrapper = require('../promise-wrapper')
const create = mongoose.Model.create

mongoose.Model.create = function () {
    return new PromiseWrapper(this, arguments, function (session, args) {
        if (args.length === 1) {
            args.push({ session })
        } else if (args.length === 2) {
            args[1]['session'] = session
        }
        return args
    }, create)
}
