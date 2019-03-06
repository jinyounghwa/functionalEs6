
const log = console.log;
const curry = f => (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);


const add = (a ,b) => a +b;

const reduce = curry((f, acc, iter) => {
    if (!iter) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    } else {
        iter = iter[Symbol.iterator]();
    }
    let cur;
    while (!(cur = iter.next()).done){
        const a = cur.value;
        acc = f(acc, a);
    }
    return acc;
});
const map = curry((f,iter) => {
    let res = [];
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
        const a = cur.value;
        res.push(f(a));
    }
    return res;
});

const filter = curry((f, iter) => {
    let res = [];
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
        const a = cur.value;
        if (f(a)) res.push(a);
        res.push(f(a));
    }
    return res;
});



const L = {};

L.range = function *(l) {
    let i = -1;
    while (++i < l) {
        log(i, 'L.range');
        yield i;
    }

};

// log(L.range(5));
//
// log(L.range(2));

const range = l => {
    let i = -1;
    let res = [];
    while (++i < l) {
        res.push(i);
    }
    return res;
};

let list = L.range(4);

//log(list);

// log(list.next().value);
// log(list.next().value);
// log(list.next().value);
// log(list.next().value);
//log(reduce(add, list));

//take 함수
const take = curry((l, iter) =>{
   let res = [];
   for ( const a of iter) {
       res.push(a);
       if (res.length === l) return res;

   }
   return res;
});

const go = (...args) => reduce((a,f) => f(a), args);
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);
//log(take(5, range(100)));
// console.time('');
// log(take(5,L.range(100)));
// console.timeEnd('');

//go(range(1000),take(5),log);

//L.map 이터레이터를 반환하는 제너레이터 함수

// L.map = function *(f,iter) {
//     for(const a of iter) yield f(a);
// };

L.map = curry(function *(f, iter) {
    for (const a of iter) {
        yield f(a);
    }
});
let it = L.map(a => a + 10, [1,2,3]);
// log(it.next());
// log(it.next());
// log(it.next());

L.filter = curry(function *(f, iter) {
    for (const a of iter) {
        if (f(a)) yield a;
    }
});

// L.filter = curry(function *(f, iter) {
//     iter = iter[Symbol.iterator]();
//     let cur;
//     while (!(cur = iter.next()).done){
//         const a = cur.value;
//         if (f(a)){
//             yield a;
//         }
//     }
// });

//let it1 = L.filter(a => a % 2, [1,2,3,4]);
// log(it2.next());
// log(it2.next());
// go(
//     range(10),
//     map(n => n + 10),
//     filter(n=> n % 2),
//     take(2),
//     log
// );

go(
    L.range(10),
    L.map(n => n + 10),
    L.filter(n=> n % 2),
    take(2),
    log
);
