
const log = console.log;
const curry = f => (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);
const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a);

const add = (a ,b) => a +b;

const reduce = curry((f, acc, iter) => {
    if (!iter) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    } else {
        iter = iter[Symbol.iterator]();
    }
    return go1(acc, function reucr(acc) {
        let cur;
        while (!(cur = iter.next()).done){
            const a = cur.value;
            acc = f(acc, a);
            // acc =acc instanceof Promise ? acc.then(acc =>f(acc, a)) :f(acc, a);
            if (acc instanceof  Promise) return acc.then(reucr);
        }
        return acc;
    });

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
   iter = iter[Symbol.iterator]();
   return function recur() {
       let cur;
       while (!(cur = iter.next()).done){
           const a = cur.value;
           if ( a instanceof  Promise) return a.then(a => {
               res.push(a);
               if (res.length == l) return res;
               return recur();
           }).catch( e => e ==nop ? recur() : Promise.reject(e));
           res.push(a);
           if (res.length == l) return res;
       }
       return res;
   }();
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
        yield go1(a,f);
    }
});

let it = L.map(a => a + 10, [1,2,3]);
// log(it.next());
// log(it.next());
// log(it.next());

const nop = Symbol('nop');

L.filter = curry(function *(f, iter) {
    for (const a of iter) {
        const b = go1(a,f);
        if( b instanceof  Promise) yield b.then(b => b ? a : Promise.reject(nop));
        else if (b) yield a;
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

// go(
//     L.range(10),
//     L.map(n => n + 10),
//     L.filter(n=> n % 2),
//     take(2),
//     log
// );
//8.2 queryStr 함수

L.entries = function *(obj) {
    for (const k in obj) yield [k, obj[k]];
};

const join = curry((sep=`,`, iter) =>  reduce((a, b) => `${a}${sep}${b}`, iter));


const queryStr = pipe(
    L.entries,
    //a=> (console.log(a),a),
    L.map(([k, v]) => `${k} =${v}`),
    function (a) {
        console.log(a);
        return a;
    },
    join('&')
);



//log(queryStr({limit:10, offset:10, type:'notice'}));

// function *a() {
//     yield 10;
//     yield 11;
//     yield 12;
//     yield 13;
// }

// log(join('-',a()));

//8.4 take,find

const users1 = [
    {age : 32},
    {age : 31},
    {age : 37},
    {age : 28},
    {age : 25},
    {age : 32},
    {age : 31},
    {age : 37}
];

const takeAll = take(Infinity);

const find = curry((f, iter) => go(
    iter,
    L.filter(f),
    take(1),
    ([a]) => a
));

//log(find(u => u.age < 30) (users));
//
// go(
//     users,
//     L.map(u => u.age),
//     find(n => n < 30),
//     log
// );
const map = curry(pipe(L.map,takeAll));

//log(map(a => a + 10, L.range(4)));

const filter = curry(pipe(L.filter,takeAll));

//log(filter(a => a % 2, range(4)));

//8.6 L.flatten

// log([[1,2],3,4,...[5,6],...[7,8,9]]);

const  isIterable = a => a && a[Symbol.iterator];

// L.flatten = function *(iter) {
//     for (const a of iter) {
//         if (isIterable(a)) for ( const b of a) yield b;
//         else yield a;
//     }
// };
L.flatten = function *(iter) {
    for (const a of iter) {
        if (isIterable(a)) yield *a;
        else yield a;
    }
};
L.deepFlat = function *f(iter) {
    for (const a of iter) if (isIterable(a)) yield* f(a);
    else yield a;
};
// log([...L.deepFlat([1, [2, [3, 4], [[5]]]])]);

let it3 = L.flatten([[1,2],3,4,...[5,6],...[7,8,9]]);
// log([...it3]);
//
// log(it3.next());
// log(it3.next());
// log(it3.next());
// log(take(6, L.flatten([[1,2],3,4,...[5,6],...[7,8,9]])));
const flatten = pipe(L.flatten, takeAll);

// log(flatten([[1,2],3,4,...[5,6],...[7,8,9]]));

// L.flatMap

// log([[1,2],[3,4],[5,6,7],8,9,[10]].flatMap(a=>a));

//log([[1,2],[3,4],[5,6,7],8,9,[10]].map(a => a.map(a=> a * a)));

L.flatMap = curry(pipe(L.map, L.flatten));

const flatMap = curry(pipe(L.map, flatten));


//let it4 = L.flatMap(map(a => a * a), [[1,2],[3,4],[5,6,7],8,9,[10]]);

let it4 = L.flatMap(a => a, [[1,2],[3,4],[5,6,7]]);

//log(flatMap(a=>a,[[1,2],[3,4],[5,6,7]]));

// log(it4.next());
// log(it4.next());
// log(it4.next());
// log(it4.next());
// log(it4.next());
// log(it4.next());
// log(it4.next());

// log([...it4]);
//
// log(flatMap(range,map(a => a + 1, [1,2,3])));

// const arr = [
//     [1,2],
//     [3,4,5],
//     [6,7,8],
//     [9,10]
// ];
//
// go(
//     arr,
//     L.flatten,
//     L.filter( a => a % 2),
//     take(3),
//     log
// );

let users = [
    { name: 'a', age: 21, family: [
    { name: 'a1', age: 53 },
    { name: 'a2', age: 47 },
    { name: 'a3', age: 16 },
    { name: 'a4', age: 15 }
        ] },
    { name: 'b', age: 24, family: [
    { name: 'b1', age: 58 },
    { name: 'b2', age: 51 },
    { name: 'b3', age: 19 },
    { name: 'b4', age: 22 }
        ] },
    { name: 'c', age: 31, family: [
    { name: 'c1', age: 64 },
    { name: 'c2', age: 62 }]},
    { name: 'd', age: 20, family:
    [
    { name: 'd1', age: 42 },
    { name: 'd2', age: 42 },
    { name: 'd3', age: 11 },
    { name: 'd4', age: 7 }
    ]}
];

// go(
//     users,
//     L.map( u => u.family),
//     L.flatten,
//     L.filter( u => u.age < 20),
//     L.map( u => u.age),
//     take(3),
//     reduce(add),
//     log
// );

// callback promise

function  add10(a, callback) {
    setTimeout(() => callback(a + 10), 100)
}

// add10( 5 , res => {
//     log(res);
// });

function add20(a) {
    return new Promise(resolve => setTimeout(()=> resolve(a + 20), 100));
}
//return 을 사용하는게 가장 큰 차이이다.

// let b = add20(5)
//     .then(add20)
//     .then(log);

// log(b);

// promise 가 callback 지옥을 해결하는게 목표가 아니라 1급으로 비동기 상황을 값으로 다룬다는 의미이다.
// promise 는 promise 클래스로 만들어지는 인스턴스를 반환한다. 대기와 종료에 대한 값을 만든다.

//9.3

const delay100 = a => new Promise(resolve =>
    setTimeout(() => resolve(a), 100));


const add5 = a => a + 5;

const n1 = 10;

// go1(go1(n1 , add5), log);
//
// const n2  = delay100(10);
//
// go1(go1(n2, add5), log);

//9.4 promise 는 비동기 상태에서 함수합성을 원할하게 한다. 모나드-상황에 따라 안전하게 함수 합성

// const g = a => a + 1;
//
// const f = a => a * a;
//
// log(f(g(1)));

// Array.of(1).map(g).map(f).forEach( r => log(r));
//
// 모나드 했을 때 잇점은 값이 없으면 함수가 동작하지 않는다.(빈값이 들어와도 동작하지 않음)

//Promise.resolve(2).then(g).then(f).then( r => log(r));

//9.5 Kleisli composition

let users3 = [
    {id:1, name:'aa'},
    {id:2, name:'bb'},
    {id:3, name:'cc'}
];

const getUserById = id => find(u => u.id == id, users3) || Promise.reject("없어요!");

const f = ({name}) => name;
const g = getUserById;
// const fg = id => f(g(id));
//
// const r = fg(2);
//
// log(fg(2));
// // user3.pop();
// // user3.pop();
//
// const r2 = fg(2);
// log(r);

const  fg = id => Promise.resolve(id).then(g).then(f).catch(a => a);

// fg(2).then(log);

//9.6
// go(Promise.resolve(1),
//     a => a +10
//     , a => Promise.reject('error~~')
//     , console.log('______')
//     , a => a + 1000
//     , a => a +10000
//     ,log).catch(a => console.log(a));

//9.7 Promise가 계속 중첩되어도 then 이면 상관없이 해도 결과는 한번에 꺼내올 수 있다.
// Promise.resolve(Promise.resolve(Promise.resolve(1))).then(log);
//
// new Promise(resolve => resolve(new Promise(resolve => resolve(1)))).then(log);

//10.1 비동기를 잘 제어해 보자

    go(
// [Promise.resolve(1),Promise.resolve(2),Promise.resolve(3)],
[2,3,4],
    map (a => Promise.resolve(a + 10)),
    //takeAll,
    log);

//10.2
go([1,2,3,4,5,6],
    L.map(a => Promise.resolve(a * a)),
    L.filter(a => {
        log(a);
        return a % 2;
    }),
    L.map(a => {
        log(a);
        return a * a;
    }),
    take(4), log);
