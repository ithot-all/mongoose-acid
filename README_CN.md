![mongoose-acid](art/logo.png)

[![Build Status](https://img.shields.io/travis/ithot-all/mongoose-acid/master.svg?style=flat-square)](https://travis-ci.org/ithot-all/mongoose-acid)

[![NPM](https://nodei.co/npm/mongoose-acid.png?compact=true)](https://npmjs.org/package/mongoose-acid)

# mongoose-acid
:sunglasses: mongoose事务助手

### 提示
如果您要使用mongodb的多文档事务功能，您的mongodb的版本需要大于4.0，并且您需要一个复制集来让事务工作，在mongodb4.2中，在分片上支持多文档事务

### 安装 
```
npm i mongoose-acid -S
``` 

### 必须项

- nodejs >= 7.6
- mongoose >= 5.2
- mongodb >= 4.0

### 用法

#### 一般使用
```javascript
const Acid = require('mongoose-acid')
await Acid(async function (session) {
    // 如何你设置了context那么this === context
    await People.findOneAndUpdate({ name: 'Acid' },{ $inc: { balance: 30 } },{ session })
    await Account.findOneAndUpdate({ name: 'Blank'},{ $inc: { balance: -30 } },{ session })
}, context)
```
#### 在koa中使用
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

### session选项的位置

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

### 调试
```javascript
Acid.set('debug', true)
```

### 注意

- 集合的不能在事务中创建，会报错，所以您在使用`mongoose`和`mongodb`的事务功能前需要先创建好集合
- 注意如果model是通过设置了`session`选项的查询返回的那么不用再次设置
- 注意`Model.create`方法的第一个参数必须是数组，第二个参数才可以设置`session`选项

### 测试

```
npm test
```
