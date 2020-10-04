/*
 *  lib/memory.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-04
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

const logger = require("../logger")(__filename)
const _util = require("./_util")

/**
 */
const initialize = _.promise((self, done) => {
    _.promise(self)
        .validate(initialize)

        .make(sd => {
            sd.cache = {
                memory: {},
                put: put,
                get: get,
            }
        })

        .end(done, self, initialize)
})

initialize.method = "memory.initialize"
initialize.description = ``
initialize.requires = {
    cache$cfg: _.is.Dictionary,
}
initialize.accepts = {
}
initialize.produces = {
    cache: {
        memory: _.is.Dictionary,
        put: _.is.Function,
        get: _.is.Function,
    },
}

/**
 */
const put = _.promise((self, done) => {
    _.promise(self)
        .validate(put)

        .make(sd => {
            const d = {}

            _util.split(sd.rule.values).forEach(value_key => {
                const value = sd[value_key]
                assert.ok(_.is.JSON(value), `${put.method}: only JSON values can be cached (key: ${value_key})`)
                d[value_key] = value
            })

            sd.cache.memory[sd.rule.key] = d
        })

        .end(done, self, put)
})

put.method = "memory.put"
put.description = ``
put.requires = {
    cache: _.is.Dictionary,
    rule: {
        key: _.is.String,
        values: [ _.is.Array, _.is.String ],
    },
}
put.accepts = {
}
put.produces = {
}

/**
 */
const get = _.promise((self, done) => {
    _.promise(self)
        .validate(get)
        .end(done, self, get)
})

get.method = "memory.get"
get.description = ``
get.requires = {
    cache: _.is.Dictionary,
    rule: {
        key: _.is.String,
        values: [ _.is.Array, _.is.String ],
    },
}
get.accepts = {
}
get.produces = {
}

/**
 *  API
 */
exports.memory = {
    get: get,
    put: put,
    initialize: initialize,
}
