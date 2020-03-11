import MVVM from './mvvm';

import Compile from './compile';

let vm = new MVVM({
    el: '#root',
    data: {
        someStr: 'hello ',
        className: 'btn',
        htmlStr: '<span style="color: #f00;">red</span>',
        child: {
            someStr: 'World !'
        }
    }
})

console.log(vm);
