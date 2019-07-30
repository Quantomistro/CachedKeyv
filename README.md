This is an extension of [Keyv](https://github.com/lukechilds/keyv). CachedKeyv uses a simple in-memory cache to store and serve data significantly faster during runtime. Actual database operations are queued up behind-the-scenes.

### Quick guide
<hr/>

CachedKeyv exposes the same get/set/delete API exposed by Keyv, with the same parameters and usage.
```js
// Import Keyv
const CachedKeyv = require('./CachedKeyv.js');

// And then one of the following
const keyv = new CachedKeyv();
const keyv = new CachedKeyv('uri');
const keyv = new CachedKeyv(options);
const keyv = new CachedKeyv('uri', options);
```
<br/>

However, creating instances of CachedKeyv is slightly different from Keyv, since CachedKeyv can take options for both the internal database and the internal cache used. See [API](#API) for more.
```js
// Example of an options object for CachedKeyv
const options = {
    db: {
        uri: 'someURI',
        namespace: 'myNamespace',
        ttl: 1000 * 60 * 10,
        serialize: JSON.stringify,
        deserialize: JSON.parse,
        store: new Map(),
        adapter: 'someAdapter'
    },
    cache: {
        ttl: 1000 * 60 * 10
    }
};
```
<br/>

Since CachedKeyv has two instances of Keyv running (one for the persistent db and one for the cache), a simple shorthand for attaching/detaching listeners to them is provided. See [API](#API) for more.
```js
// Attach listeners
keyv.on('db', 'error', console.log);      // Attaches listener to only db
keyv.on('cache', 'error', console.log);   // Attaches listener to only cache
keyv.on('error', console.log);            // Attaches listener to both db and cache
```
<br/>

### API
<hr/>

#### `new CachedKeyv([uri], [options])`

Returns a CachedKeyv instance.
<br/>

##### `uri`
Type: `String`
Default: `undefined`
<br/>

The connection string uri. *This is merged into the options object as `options.db.uri`, rather than `options.uri` (as done in Keyv)*
<br/>

##### `options`
Type: `object`
<br/>

This options object contains options for both the internal db and internal cache (both instances of Keyv). As such, `options.db` is passed to the internal Keyv instance for the persistent database, while `options.cache` is passed to the Keyv instance for the cache.
<br/>

##### `options.db`
Type: `object`
<br/>

This is the same as the options that Keyv accepts, documented [here](https://github.com/lukechilds/keyv#options). This is passed on to the internal Keyv instance for the persistent database.
<br/>

##### `options.cache`
Type: `object`
<br/>

This object contains options for the internal cache. Currently, it only takes one option.
<br/>

##### `options.cache.ttl`
Type: `number`
<br/>

Number specifying the default time-to-live expiry for the cache. This can be overriden by the set method for CachedKeyv instances.
<br/>

#### `Instance`

The CachedKeyv instances expose the same get/set/delete/clear API that Keyv exposes. See [here]() for more.
<br/>

##### `on([emitter], event, listener)`

Shorthand for attaching listeners to either the internal db, cache, or both. <br/>
Example:
```js
// Attach listeners
keyv.on('db', 'error', console.log);      // Attaches listener to only db
keyv.on('cache', 'error', console.log);   // Attaches listener to only cache
keyv.on('error', console.log);            // Attaches listener to both db and cache
```
<br/>

##### `off([emitter], event, listener)`

Shorthand for detaching listeners from either the internal db, cache, or both. <br/>
Example:
```js
// Detach listeners
keyv.off('db', 'error', console.log);      // Detaches listener from only db
keyv.off('cache', 'error', console.log);   // Detaches listener from only cache
keyv.off('error', console.log);            // Detaches listener from both db and cache
```
<br/>
