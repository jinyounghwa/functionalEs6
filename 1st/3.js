const log = console.log;

const list = [1, 2, 3];
for (let i = 0; i < list.length; i++){
    log(list[i]);
}

const str = 'abc';
for (let i = 0; i < str.length; i++) {
    log(list[i]);

}

for ( const a of list ) {
    log(a);
}

for (const a of str) {
    log(a);
}

