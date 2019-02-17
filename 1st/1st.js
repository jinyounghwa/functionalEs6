const a =10;
const add10 = a => a + 10;
const r = add10(a);

console.log(r);

const f1 = () => () => 1;

console.log(f1());