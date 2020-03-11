import Watcher from './watcher';

export default class Compile {
    constructor(el, vm) {
        this.$vm = vm;
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);
        if (this.$el) {
            this.$fragment = Compile.node2Fragment(this.$el);
            console.log(this.$fragment);
            this.init();
            this.$el.appendChild(this.$fragment);
        }

    }

    static node2Fragment (el) {
        let fragment = document.createDocumentFragment(), child;
        // 将原生节点拷贝到fragment
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    }

    init() {
        this.compileElement(this.$fragment);
    }

    compileElement (el) {
        let childNodes = el.childNodes,
            me = this;
        [].slice.call(childNodes).forEach(function(node) {
            let text = node.textContent;
            let reg = /\{\{(.*)\}\}/;    // 表达式文本
            // 按元素节点方式编译
            if (me.isElementNode(node)) {
                me.compileNode(node);
            } else if (me.isTextNode(node) && reg.test(text)) {
                me.compileText(node, RegExp.$1);
            }
            // 遍历编译子节点
            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
        });
    }

    compileNode (node) {
        let nodeAttrs = node.attributes,
            me = this;


        [].slice.call(nodeAttrs).forEach(function(attr) {
                let attrName = attr.name;
                if (me.isDirective(attrName)) {
                    let val = attr.value;               // 指令值
                    let dir = attrName.substring(2);    // 指令名

                    // 事件指令
                    if (me.isEventDirective(dir)) {
                        compileUtil.eventHandler(node, me.$vm, val, dir);
                        // 普通指令
                    } else {
                        compileUtil[dir] && compileUtil[dir](node, me.$vm, val);
                    }

                    node.removeAttribute(attrName);
                }
        });
    }

    compileText (node, exp) {
        compileUtil.text(node, this.$vm, exp);
    }

    isDirective (attr) {
        return attr.indexOf('v-') === 0;
    }

    isEventDirective (dir) {
        return dir.indexOf('on') === 0;
    }

    isElementNode (node) {
        return node.nodeType === 1;
    }

    isTextNode (node) {
        return node.nodeType === 3;
    }
}

const compileUtil = {
    bind (node, vm, exp, dir) {
        // 更新函数
        const updaterFn = updater[dir + 'Updater'];
        updaterFn && updaterFn(node, this._getVMVal(vm, exp));

        new Watcher(vm, exp, (value, oldValue) => {
            updaterFn && updaterFn(node, value, oldValue);
        });

    },

    // 事件处理
    eventHandler (node, vm, exp, dir) {
        let eventType = dir.split(':')[1],
            fn = vm.$options.methods && vm.$options.methods[exp];

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },

    _getVMVal (vm, exp) {
        let val = vm;
        exp = exp.split('.');
        exp.forEach(k => {
            val = val[k];
        });
        return val;
    },


    _setVMVal (vm, exp, value) {
        let val = vm;
        exp = exp.split('.');
        exp.forEach((k, i) => {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k];
            } else {
                console.log(k);
                console.log(val[k]);
                val[k] = value;
            }
        });
    },

    text (node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },

    html (node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },


    model (node, vm, exp) {
        this.bind(node, vm, exp, 'model');

        let me = this,
            val = this._getVMVal(vm, exp);
        console.log(node);
        node.addEventListener('input', e => {
            let newValue = e.target.value;
            console.log(val + '   ===>  ' + newValue);
            if (val === newValue) {
                return;
            }

            me._setVMVal(vm, exp, newValue);
            val = newValue;
        });
    },

    class (node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },
};

const updater = {
    // 更新文字节点
    textUpdater(node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value;
    },

    // 更新html节点
    htmlUpdater(node, value) {
        node.innerHTML = typeof value === 'undefined' ? '' : value;
    },

    modelUpdater (node, value, oldValue) {
        console.log('modelUpdater');
        node.value = typeof value === 'undefined' ? '' : value;
    },

    classUpdater (node, value, oldValue) {
        let className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');

        let space = className && String(value) ? ' ' : '';

        node.className = className + space + value;
    },
};




