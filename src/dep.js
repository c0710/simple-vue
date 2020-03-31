
let uid = 0;

// watcher栈
const targetStack = [];

// 将上一个watcher推到栈里，更新Dep.target为传入的_target变量。
export function pushTarget(_target) {
    if (Dep.target) targetStack.push(Dep.target)
    Dep.target = _target
}

// 取回上一个watcher作为Dep.target，并且栈里要弹出上一个watcher。
export function popTarget() {
    Dep.target = targetStack.pop()
}

export default class Dep {
    constructor() {
        this.id = uid++;
        this.subs = [];
    }


    addSub(sub) {
        this.subs.push(sub);
    }

    removeSub (sub) {
        var index = this.subs.indexOf(sub);
        if (index !== -1) {
            this.subs.splice(index, 1);
        }
    }

    depend () {
        Dep.target.addDep(this);
    }

    notify() {
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}

Dep.Target = null;
