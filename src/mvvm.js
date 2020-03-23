import Compile from './compile';
import { observe } from './observer';


export default class MVVM {
    constructor(options) {
        this.$options = options || {};

        let data = this._data = this.$options.data;
        const me = this;

        // 数据代理
        // 实现 vm.xxx -> vm._data.xxx
        Object.keys(data).forEach(key => {
            me._proxyData(key);
        });

        this._initComputed();

        observe(data, this);

        this.$compile = new Compile(options.el || document.body, this);

    }

    _proxyData (key) {
        const me = this;
        Object.defineProperty(me, key, {
            configurable: false,
            enumerable: true,
            get () {
                return me._data[key];
            },
            set (newVal) {
                me._data[key] = newVal;
            }
        });
    }

    _initComputed () {
        const me = this;
        const computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(key => {
                console.log(key);
                Object.defineProperty(me, key, {
                    get: typeof computed[key] === 'function'
                        ? computed[key]
                        : computed[key].get,
                    set: function() {}
                });
            });
        }
    }
}
