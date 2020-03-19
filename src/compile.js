import Watcher from './watcher';
import {parseText, replace} from "./utils";

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
        [].slice.call(childNodes).forEach(node => {
            let text = node.textContent;
            let reg = /\{\{[^\{\}\s]*\}\}/gm;     // 表达式文本
            // 按元素节点方式编译
            if (me.isElementNode(node)) {
                me.compileNode(node);
            } else if (me.isTextNode(node)) {
                // 如this is number1: {{number1}}这种，我们必须转换为两个文本节点，
                // 一个是this is number1: ，它不需要进行任何处理；另一个是{{number1}}，它需要进行数据绑定，并实现双向绑定
                let tokens = parseText(text);
                let frag = document.createDocumentFragment();
                for(let i = 0, _i = tokens.length; i < _i; i++) {
                    let token = tokens[i],
                        el = document.createTextNode(token.value);
                    frag.appendChild(el);
                }
                // 将原本的一个文本节点替换为新的分为几份的文本节点
                let fragClone = frag.cloneNode(true);
                if(tokens.length) {
                    let newNodeChild = fragClone.childNodes;
                    tokens.forEach((token, i) => {
                        // 给其中需要监听的文本绑定更新事件
                        if (token.tag) {
                            me.compileText(newNodeChild[i], token.value);
                        }
                    });

                    replace(node, fragClone);
                }
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
        console.log(node, exp);
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
        updaterFn && updaterFn(node, this._getVMVal(vm, exp), exp);

        new Watcher(vm, exp, (value, oldValue) => {
            updaterFn && updaterFn(node, value, oldValue, exp);
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
        node.addEventListener('input', e => {
            let newValue = e.target.value;
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

    modelUpdater (node, value) {
        node.value = typeof value === 'undefined' ? '' : value;
    },

    classUpdater (node, value, oldValue) {
        let className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');

        let space = className && String(value) ? ' ' : '';

        node.className = className + space + value;
    },
};




