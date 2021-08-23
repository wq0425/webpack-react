// 汇总所有的js
// import '@babel/polyfill'; // 包含es6的高级语法转换（用于兼容）
import { sum } from './module1';
import { sub } from './module2';
import module3 from './module3';
import a from '../json/test.json';
import '../css/index.less';

console.log(sum(1,2));
console.log(sub(3,4));
console.log(module3.mul(5,6));
console.log(module3.div(10,5));
console.log(a)
console.log(1===1)
setTimeout(() => {
    console.log('定时器')
}, 0)
let x = 2;
console.log(x)
let myPromise = new Promise((resolve) => {
    setTimeout(() => {
        resolve('哈哈')
    }, 2000)
})

myPromise.then(data => {
    console.log(data)
})
// myPromise()