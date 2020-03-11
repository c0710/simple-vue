

import Dep from './dep';

export default class Watcher {
    constructor(vm, exp, cb) {
        this.vm = vm;
        this.exp = exp;
        this.cb = cb;

        this.depIds = {};

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
        console.log('addDep');
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    }

    get() {
        Dep.target = this;          // 将当前订阅者指向自己
        let value = this.vm[this.exp];   // 触发getter，添加自己到属性订阅器中
        Dep.target = null;          // 添加完毕，重置
        return value;
    }
}
