"use strict";

const Keyv = require('keyv');

class CachedKeyv {
    constructor(uri, options) {
        let dbOpts, cacheOpts;
        if (typeof uri === 'string') {
            dbOpts = Object.assign({ uri }, options ? options.db : {});
            cacheOpts = Object.assign(options ? options.cache : {});
        } else {
            dbOpts = uri && uri.db;
            cacheOpts = uri && uri.cache;
        }

        this.db = new Keyv(dbOpts);
        this.cache = new Keyv({ ttl: cacheOpts.ttl });
        this.queue = [];
        this.busy = false;

        const fn = () => {
            if (this.busy) return;
            this.syncDb();
        };
        setInterval(fn, 1000);
    }

    on(emitter, event, listener) {
        if (emitter === 'db') {
            this.db.on(event, listener);
        } else if (emitter === 'cache') {
            this.cache.on(event, listener);
        } else if (typeof event === 'function') {
            this.db.on(emitter, event);
            this.cache.on(emitter, event);
        }
    }

    off(emitter, event, listener) {
        if (emitter === 'db') {
            this.db.off(event, listener);
        } else if (emitter === 'cache') {
            this.cache.off(event, listener);
        } else if (typeof event === 'function') {
            this.db.off(emitter, event);
            this.cache.off(emitter, event);
        }
    }

    enqueue(task) {
        this.queue.push(task);
    }

    async syncDb() {
        let finished = 0;
        if (this.queue.length) {
            this.busy = true;
            while (this.queue.length) {
                try {
                    const task = this.queue.shift();
                    await task();
                    finished++;
                } catch (err) {
                    this.db.emit('error', err);
                }
            }
            this.busy = false;
        }
        return finished;
    }

    async get(key) {
        let data = await this.cache.get(key);
        if (!data) {
            data = await this.db.get(key);
            await this.cache.set(key, data);
        }
        return data;
    }

    async set(key, value, ttl) {
        await this.cache.set(key, value, ttl);
        this.enqueue(() => this.db.set(key, value, ttl));
    }

    async delete(key) {
        await this.cache.delete(key);
        this.enqueue(() => this.db.delete(key));
    }

    async clear() {
        await this.cache.clear();
        this.enqueue(() => this.db.clear());
    }
}

module.exports = CachedKeyv;
