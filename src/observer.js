
import Dep from './dep';

let obj = { name: 'wang' };

observe(obj);

obj.name = 'li';

function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }

    Object.keys(data).forEach(key => {
        console.log(key);
        defineReactive(data, key, data[key]);
    })
}

function defineReactive(data, key, val) {
    let dep = new Dep();
    // 监听子属性
    observe(val);

    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get() {
            return val;
        },

        set(newVal) {
            if ( val === newVal) return;
            console.log(`listen ${key}: ${val} => ${newVal}`);
            val = newVal;
        }
    })
}
