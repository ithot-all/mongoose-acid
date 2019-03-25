const mongoose = require('mongoose')
const PromiseWrapper = require('../promise-wrapper')
const remove = mongoose.Model.prototype.remove

mongoose.Model.prototype.remove = function () {
    return new PromiseWrapper(this, arguments, function (session, args) {
        if (args.length === 1) {
            args[0]['session'] = session
        } else if (args.length === 0) {
            args.push({ session })
        }
        return args
    }, remove)
}
