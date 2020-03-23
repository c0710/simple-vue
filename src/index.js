import MVVM from './mvvm';

import Compile from './compile';

let vm = new MVVM({
    el: '#root',
    data: {
        someStr: 'hello ',
        someStr1: 'str11111',
        someStr2: 'str222222',
        classStr: 'red',
        htmlStr: '<span style="color: #f00;">red</span>',
        child: {
            subStr: 'World !'
        }
    },
    methods: {
        clickBtn (e) {
            var randomStrArr = ['childOne', 'childTwo', 'childThree'];
            this.child.subStr = randomStrArr[parseInt(Math.random() * 3)] + Math.round(Math.random() * 10);
        }
    },

    computed: {
        someStr12() {
            return this.someStr + this.someStr2
        }
    }

});

console.log(vm);
