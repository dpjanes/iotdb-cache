# iotdb-cache

Cache the result expensive functions.

Notes:

* results have to be JSON

## Examples

### In memory cacher

Cached result will disappear after execution

    const cache = require("iotdb-cache")

    _.promise({
        cache$cfg: {},
    })
        .then(cache.memory.initialize)
        .make(sd => {
            sd.rule = {
                key: "key-1",       // usually a computed function, based on inputs
                values: "tokens",   // expensive_function creates "tokens"
                method: expensive_function,
            }
        })
        .then(cache.execute) // expensive_function will be called
        .then(cache.execute) // the cached value will be called


### File System Cacher

Cached result will be stored in files

    const cache = require("iotdb-cache")
    const fs = require("iotdb-fs")
    const path = require("path")
    const os = require("os")

    _.promise({
        cache$cfg: {
            path: path.join(os.homedir(), ".fs-cache"),
        },
    })
        .then(fs.cache)
        .make(sd => {
            sd.rule = {
                key: "key-1",
                values: "tokens",   
                method: expensive_function,
            }
        })
        .then(cache.execute) // expensive_function will be called
        .then(cache.execute) // the cached value will be called

### Null Cacher

This will do nothing

    const cache = require("iotdb-cache")

    _.promise({
        cache$cfg: {},
    })
        .then(cache.null.initialize)
        .make(sd => {
            sd.rule = {
                key: "key-1",       // usually a computed function, based on inputs
                values: "tokens",   // expensive_function creates "tokens"
                method: expensive_function,
            }
        })
        .then(cache.execute) // expensive_function will be called
        .then(cache.execute) // expensive_function will be called

### No Cacher

`cache.execute` looks for `self.cache`. If it's not there it will just
call `method`. So you can safely use `cache` in libraries

    const cache = require("iotdb-cache")

    _.promise({})
        .then(cache.execute) // expensive_function will be called
        .then(cache.execute) // expensive_function will be called

## Cachers

Built-in

* memory
* null

Other IOTDB libaries

* iotdb-fs

Coming Soon?

* iotdb-redis
