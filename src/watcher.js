import Dep, {
    pushTarget,
    popTarget
} from './dep';

export default class Watcher {
    constructor(vm, expOrFn, cb, opts) {
        this.vm = vm;
        this.expOrFn = expOrFn;
        this.cb = cb;
        this.depIds = {};
        this.opts = opts;
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
        Dep.target = this; // 将当前订阅者指向自己
        var value = this.getter.call(this.vm, this.vm); // 触发getter，添加自己到属性订阅器中
        Dep.target = null; // 添加完毕，重置
        var s = this.vm.classStr;
        return value;

        // pushTarget(this); // 将当前订阅者指向自己
        // var value = this.getter.call(this.vm, this.vm); // 触发getter，添加自己到属性订阅器中
        // popTarget(); // 添加完毕，重置
        // return value
    }

    parseGetter(exp) {
        if (/(^\w.$)/.test(exp)) {
            return obj => obj[exp]
        }

        let exps = exp.split('.');

        return obj => {
            for (let i = 0, len = exps.length; i < len; i++) {
                if (!obj) return;
                obj = obj[exps[i]];
            }
            return obj;
        }
    }
}