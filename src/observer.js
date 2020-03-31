import Dep from './dep';

class Observer {
    constructor(data) {
        this.data = data;
        this.walk(data);
    }

    walk(data) {
        const me = this;
        Object.keys(data).forEach(function (key) {
            me.convert(key, data[key]);
        });
    }

    convert(key, val) {
        this.defineReactive(this.data, key, val);
    }

    defineReactive(data, key, val) {
        let dep = new Dep();
        let childObj = observe(val);
        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get() {
                // console.log(`检测到 ${key} 被读取`)
                if (Dep.target) {
                    dep.depend();
                }
                return val;
            },
            set(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                // 新的值是object的话，进行监听
                childObj = observe(newVal);
                // 通知订阅者
                dep.notify();
            }
        });
    }
}


export const observe = (data, vm) => {
    if (!data || typeof data !== 'object') {
        return;
    }

    return new Observer(data);
};