![mongoose-acid](art/logo.png)

[![Build Status](https://img.shields.io/travis/ithot-all/mongoose-acid/master.svg?style=flat-square)](https://travis-ci.org/ithot-all/mongoose-acid)

[![NPM](https://nodei.co/npm/mongoose-acid.png?compact=true)](https://npmjs.org/package/mongoose-acid)


# mongoose-acid
:sunglasses: mongoose transaction helper

### install 
```
npm i mongoose-acid -S
``` 

### required

```
nodejs >= 7.6 | mongoose >= 5.2 | mongodb >= 4.0
```

### usage

#### normal
```javascript
const Acid = require('mongoose-acid')
await Acid(async function (session) {
    // if you set context then this === context
    await People.findOneAndUpdate({ name: 'Acid' },{ $inc: { balance: 30 } },{ session })
    await Account.findOneAndUpdate({ name: 'Blank'},{ $inc: { balance: -30 } },{ session })
}, context)
```
#### in koa
```javascript
const Acid = require('mongoose-acid')
const app = new Koa()
app.use(Acid.middleware())
app.use(async (ctx) => {
    await ctx.acid(async function(session) {
      // this === ctx
    })
})
```

### session option position

- `Model.create([], { session })`
- `Model.deleteOne(condition, { session })`
- `Model.deleteMany(condition, { session })`
- `Model.updateOne(condition, update, { session })`
- `Model.updateMany(condition, update, { session })`
- `Model.update(condition, update, { session })`
- `Model.insertMany(docs, { session })`
- `Model.findById(id, selects, { session })`
- `Model.findByIdAndUpdate(id, update, { session })`
- `Model.findByIdAndRemove(id, { session })`
- `Model.findByIdAndDelete(id, { session })`
- `Model.findOne(condition, selects, { session })`
- `Model.findOneAndUpdate(condition, update, { session })`
- `Model.findOneAndRemove(condition, { session })`
- `Model.findOneAndDelete(condition, { session })`
- `model.save({ session })` 
- `model.remove({ session })`

### notice
- Note that if the model is returned by a query with the session option set, you do not need to set it again
- Note that the first argument to the `Model.create` method must be an array, and the second argument can set the session option

### test

```
npm test
```
