import MVVM from './mvvm';

import Compile from './compile';

let vm = new MVVM({
    el: '#root',
    data: {
        someStr: 'hello ',
        className: 'btn',
        htmlStr: '<span style="color: #f00;">red</span>',
        child: {
            subStr: 'World !'
        }
    },
    methods: {
        clickBtn (e) {
            var randomStrArr = ['childOne', 'childTwo', 'childThree'];
            this.child.subStr = randomStrArr[parseInt(Math.random() * 3)];
        }
    }

});

console.log(vm);
