class PromiseWrapper {

    constructor(ctx, args, handler, proxy) {
        this.ctx = ctx
        this.args = args
        this.handler = handler
        this.proxy = proxy
    }

    inject (session) {
        this.session = session
    }

    exec () {
        let args = Array.prototype.slice.apply(this.args)
        if (this.session) {
            args = this.handler(this.session, args)
        }
        return proxy.call(this.ctx, args)
    }

    then (fulfilled, rejected) {
        return this.exec().then(fulfilled, rejected)
    }

    catch (rejected) {
        return this.exec().catch(rejected)
    }
}

module.exports = PromiseWrapper