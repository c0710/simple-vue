import Compile from './compile';
import { observe } from './observer';
import Watcher from './watcher'


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

        // 计算属性
        this._initComputed();

        // watch
        this._initWatch();

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
                Object.defineProperty(me, key, {
                    get: typeof computed[key] === 'function'
                        ? computed[key]
                        : computed[key].get,
                    set: typeof computed[key] === 'function'
                        ? function() {}
                        : computed[key].set,
                });
            });
        }
    }

    _initWatch() {
        const me = this;
        const watch = this.$options.watch;

        for (let key in watch) {

            let watchOpt = watch[key];
            MVVM.createWatcher(me, key, watchOpt);
        }
    }

    // expOrFn 是 监听的 key，cb 是监听回调，opts 是所有选项
    $watch (expOrFn, cb, opts) {
        let watcher = new Watcher(this, expOrFn, cb, opts);



        // 设定了立即执行，所以马上执行回调

        if (opts && opts.immediate) {
            cb.call(this, watcher.value);
        }
    }

    static createWatcher (vm, expOrFn, handler, opts) {

        // 监听属性的值是一个对象，包含handler，deep，immediate

        if (typeof handler === "object") {
            opts= handler;
            handler = handler.handler
        }



        // 回调函数是一个字符串，从 vm 获取

        if (typeof handler === 'string') {
            handler = vm[handler]
        }



        // expOrFn 是 key，options 是watch 的全部选项

        vm.$watch(expOrFn, handler, opts)
    }

}
