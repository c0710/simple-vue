import Compile from './compile';


export default class MVVM {
    constructor(options) {
        this.$options = optiojns || {};

        let data = this._data = this.$options.data;
        const me = this;

        // 数据代理
        // 实现 vm.xxx -> vm._data.xxx
        Object.keys(data).forEach(key => {
            me._proxyData(key);
        });

        observe(data, this);

        this.$compile = new Compile(options.el || document.body, this)

    }

    _proxyData (key, setter, getter) {
        var me = this;
        setter = setter ||
            Object.defineProperty(me, key, {
                configurable: false,
                enumerable: true,
                get: function proxyGetter() {
                    return me._data[key];
                },
                set: function proxySetter(newVal) {
                    me._data[key] = newVal;
                }
            });
    },
}
