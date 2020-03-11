
let uid = 0;

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
        console.log(this.subs);
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}

Dep.Target = null;
