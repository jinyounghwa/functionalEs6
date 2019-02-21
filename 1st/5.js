const log = console.log;

function *gen() {
    yield 1;
    if(false) yield 2;
    yield 3;
    return 100;
}

let iter = gen();
log(iter[Symbol.iterator]() == iter);
log(iter.next());
log(iter.next());
log(iter.next());
log(iter.next());

for (const a of gen()) log(a);

log('------odds')
function *infinity(i = 0 ) {
    while (true) yield i++;
}

function *limit(l , iter) {
    for (const a of iter) {
        yield a;
        if( a ==l ) return;
    }
}

function *odds(l) {
    for (const a of limit(l,infinity(1))) {
        if( a % 2) yield a;
        if(a ==l) return;
    }
}

let iter2 = odds(10);
log(iter2.next());
log(iter2.next());
log(iter2.next());
log(iter2.next());
log(iter2.next());
log(iter2.next());
log(iter2.next());

for (const a of odds(40)) log(a);

log(...odds(10))
log([...odds(10), ...odds(20)]);

const [a, b, ...rest] = odds(10);
log(a);
log(b);
log(rest);

const products = [
    { name : '반팔티', price:15000},
    { name : '긴팔티', price:20000},
    { name : '핸드폰케이스', price:15000},
    { name : '후드티', price:30000},
    { name : '바지', price:25000}
];

const map = (f,iter) => {

    let res = [];
    for (const a of iter ) {
        res.push(f(a));
    }
    return res;
};

let prices = [];
for (const p of products ) {
    prices.push(p.price);
}


log(map(p=> p.name, products));
log(map(p=> p.price, products));

log([1,2,3].map(a=>a + 1));
log(map(el => el.nodeName, document.querySelectorAll('*')));

// const it = document.querySelectorAll('*')[Symbol.iterator]();
// log(it.next());
// log(it.next());
// log(it.next());
// log(it.next());
// log(it.next());

function  *gen() {
    yield 2;
   if (false)  yield 3;
    yield 4;
}
log(map(a=> a * a, gen()));

let m = new Map();
m.set('a', 10);
m.set('b', 20);
const it = m[Symbol.iterator]();
log(new Map(map(([k,a]) =>[k, a * 2], m ))); // 키와 값을 뒤바꿀 수 있다. 이거 정말 좋다.

