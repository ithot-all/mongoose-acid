const mongoose = require('mongoose')
const PromiseWrapper = require('../promise-wrapper')
const save = mongoose.Model.prototype.save

mongoose.Model.prototype.save = function () {
    return new PromiseWrapper(this, arguments, function (session, args) {
        if (args.length === 1) {
            args[0]['session'] = session
        } else if (args.length === 0) {
            args.push({ session })
        }
        return args
    }, save)
}
