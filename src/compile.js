

export default class Compile {
    constructor(el) {
        this.$el = isElement(el) ? el : document.querySelector(el);
        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el);
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
        let childNodes = el.childNodes, me = this;
        [].slice.call(childNodes).forEach(function(node) {
            let text = node.textContent;
            let reg = /\{\{(.*)\}\}/;    // 表达式文本
            // 按元素节点方式编译
            if (me.isElementNode(node)) {
                me.compile(node);
            } else if (me.isTextNode(node) && reg.test(text)) {
                me.compileText(node, RegExp.$1);
            }
            // 遍历编译子节点
            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
        });
    },
}


function isElement(obj) {
    if (obj && obj.nodeType === 1) {//先过滤最简单的
        if( window.Node && (obj instanceof Node )){ //如果是IE9,则判定其是否Node的实例
            return true; //由于obj可能是来自另一个文档对象，因此不能轻易返回false
        }
        try {//最后以这种效率非常差但肯定可行的方案进行判定
            testDiv.appendChild(obj);
            testDiv.removeChild(obj);
        } catch (e) {
            return false;
        }
        return true;
    }
    return false;
}
