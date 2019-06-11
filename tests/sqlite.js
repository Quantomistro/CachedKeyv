const CachedKeyv = require('../index.js');

const obj = {
    name: 'Panda',
    id: '12345',
    likes: ['sleeping', 'eating'],
    friends: new Set(['Grizzly', 'Polar'])
};

(async function main() {
    const rand = Math.floor(Math.random() * 1000000);
    const ckv = new CachedKeyv(`sqlite://./${rand}.sqlite`);
    ckv.on('error', e => { throw e });

    // 1k writes
    const t1 = Date.now();
    for (let x = 0; x <= 1000; x++) {
        await ckv.set(x, obj);
    }

    // 1k reads
    const t2 = Date.now();
    for (let x = 0; x <= 1000; x++) {
        await ckv.get(x);
    }

})();
