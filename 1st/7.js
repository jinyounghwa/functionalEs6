
const log = console.log;
const curry = f => (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);

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

const add = (a,b) => a + b;

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


let list = L.range(4);

log(list);

// log(list.next().value);
// log(list.next().value);
// log(list.next().value);
// log(list.next().value);
log(reduce(add, list));



