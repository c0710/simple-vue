
/**
 * @param str  将其字符串转化为文本节点，
 * 如this is number1: {{number1}}这种，我们必须转换为两个文本节点，
 * 一个是this is number1: ，它不需要进行任何处理；另一个是{{number1}}，它需要进行数据绑定，并实现双向绑定
 * @returns {Array}
 */
const parseText = str => {
    let reg = /\{\{(.+?)\}\}/ig;
    let matchs = str.match(reg), match, tokens = [], index, lastIndex = 0;

    while (match = reg.exec(str)) {
        index = match.index
        if (index > lastIndex) {
            tokens.push({
                value: str.slice(lastIndex, index)
            })
        }
        tokens.push({
            value: match[1],
            html: match[0],
            tag: true
        });
        lastIndex = index + match[0].length
    }

    return tokens;
};

const replace = (target, el) => {
    var parent = target.parentNode;
    if (parent) {
        parent.replaceChild(el, target)
    }
};


export {
    parseText,
    replace
}
