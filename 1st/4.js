const log = console.log;


//Array- 이터러블
log('Arr-----------');
const arr = [1,2,3];
let iter1 = arr[Symbol.iterator]();

for (const a of iter1) log(a);




//Set
log('Set-----------');
const set = new Set([1,2,3]);
for (const a of set) log(a);



//Map
//map.keys(); 이터레이터를 리턴
log('Map-----------');
const map = new Map([['a',1],['b',2],['c',3]]);
for (const a of map.keys()) log(a);
for (const a of map.values()) log(a);
for (const a of map.entries()) log(a);



//Symbol.iterator
//

const iterable = {
    [Symbol.iterator]() {
        let i = 3;
        return {
            next() {
                return i === 0 ? {done:true} : { value : i--, done: false}
            },
            [Symbol.iterator]() {return this;}
        }
    }
}

let iterator = iterable[Symbol.iterator]();
log(iterator.next());
// log(iterator.next());
// log(iterator.next());
// log(iterator.next());

for (const a of iterator) log(a);

log('Array-----------');

const arr2 = [1,2,3];

let iter2 = arr2[Symbol.iterator]();
// iter.next();
log(iter2[Symbol.iterator]() === iter2);
for (const a of arr2) log(a);

log('queryselector-----------');

//for (const a of document.querySelectorAll('*')) log(a);
// const all = document.querySelectorAll('*');
// let iter3 = all[Symbol.iterator]();
// log('queryselector-----------');
//
// log(iter3.next());
// log(iter3.next());
// log(iter3.next());




log('전개연산자-----------');
//a[Symbol.iterator] = null;
const a = [1,2];
log([...a, ...arr, ...set, ...map.keys()]);

