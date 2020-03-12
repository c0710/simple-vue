

import Dep from './dep';

export default class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm;
        this.expOrFn = expOrFn;
        this.cb = cb;
        this.depIds = {};

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = this.parseGetter(expOrFn.trim());
        }

        // 此处为了触发属性的getter，从而在dep添加自己
        this.value = this.get();
    }

    update() {
        this.run();
    }

    run() {
        let value = this.get();
        let oldVal = this.value;

        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal)
        }
    }

    addDep(dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    }

    get() {
        Dep.target = this;          // 将当前订阅者指向自己
        var value = this.getter.call(this.vm, this.vm);   // 触发getter，添加自己到属性订阅器中
        Dep.target = null;          // 添加完毕，重置
        return value;
    }

    parseGetter (exp) {
        if (/[^\w.$]/.test(exp)) return;

        var exps = exp.split('.');

        return function(obj) {
            for (var i = 0, len = exps.length; i < len; i++) {
                if (!obj) return;
                obj = obj[exps[i]];
            }
            return obj;
        }
    }
}
