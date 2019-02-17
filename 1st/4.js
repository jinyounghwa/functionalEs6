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