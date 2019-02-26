const  log = console.log;
const curry = f => (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);

const products = [
    { name : '반팔티', price:15000, quantity:1},
    { name : '긴팔티', price:20000,quantity:2},
    { name : '핸드폰케이스', price:15000,quantity:3},
    { name : '후드티', price:30000,quantity:4},
    { name : '바지', price:25000,quantity:5}
];

//코드를 값으로 다루어 표현력 높이기

const reduce = curry((f, acc, iter) => {
    if (!iter) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    }
    for ( const a of iter) {
        acc = f(acc, a);
    }
    return acc;
});
const map = curry((f,iter) => {

    let res = [];
    for (const a of iter ) {
        res.push(f(a));
    }
    return res;
});
const filter = curry((f, iter) => {
    let res = [];
    for (const a of iter) {
        if (f(a)) res.push(a);
    }

    return res;
});
const add = (a ,b) => a +b;

const go = (...args) => reduce((a,f) => f(a), args);
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);


go(
    0,
    a => a + 1,
    a => a + 10,
    a => a + 100,
    log
);

const f = pipe(
    // (a, b) => a + b,
    a => a + 1,
    a => a + 10,
    a => a + 100);

log(f(0,1));

const total_price = pipe(
    map(p=>p.price),
    reduce(add));

const base_total_price = predi => pipe(
    filter(predi),
    total_price);

go(
    products,
    products => filter(p => p.price < 20000, products),
    products => map(p => p.price, products),
    prices => reduce(add, prices),
    log
);
go(
    products,
    base_total_price(p => p.price < 20000),
    log
);
go(
    products,
    base_total_price(p => p.price >= 20000),
    log
);
//curry
go(
    products,
    filter(p => p.price < 20000),
    map(p => p.price),
    reduce(add),
    log
);


const mult = curry((a, b) => (a * b));

log(mult(1)(2));

const mult3 = mult(3);

log(mult3(10));
log(mult3(5));
log(mult3(3));


const add1 = (a,b) => a+b;

const sum = curry((f, iter) => go(
    iter,
    map(f),
    reduce(add)));

log(sum(p => p.quantity, products));

// const total_quantity = pipe(
//     map( p => p.quantity),
//     reduce(add1));
//
//
//
// log(total_quantity(products));

// const total_price1 = pipe(
//     map(p => p.price * p.quantity),
//     reduce(add1));
//
//
// log(total_price1(products));

const total_quantity = sum(p => p.quantity);

const total_price1 = sum(p => p.price * p.quantity);

log(total_price1(products));

log(total_quantity(products));