/*
 *  lib/execute.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-03
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
const execute = _.promise((self, done) => {
    _.promise.validate(self, execute)

    // caching is always optional
    if (!self.cache) {
        _.promise(self)
            .then(self.rule.method)
            .end(done, self, self.rule.method)

        return
    }

    _.promise(self)
        .make(sd => {
            sd.key = sd.rule.key
            delete sd.json
        })

        // get cached json 
        .then(self.cache.get)

        // if have a cached json, unpack and we're done
        .make(sd => {
            if (!_.is.Dictionary(sd.json)) {
                return
            }

            _util.split(sd.rule.values).forEach(value_key => {
                self[value_key] = sd.json[value_key]
            })

            _.promise.bail(sd)

            logger.debug({
                method: execute.method,
                calling: sd.rule.method.method,
                key: sd.rule.key,
            }, "not in cache")
        })

        // run the cache method
        .then(self.rule.method)

        // store the cached values 
        .make(sd => {
            sd.key = sd.rule.key

            // can't directly use sd.json!
            const cached = {}

            _util.split(sd.rule.values).forEach(value_key => {
                assert.ok(_.is.JSON(sd[value_key]), 
                    `${execute.method}: only JSON values can be cached (key: "${value_key}")`)
                cached[value_key] = sd[value_key]
            })

            sd.json = cached
        })
        .then(self.cache.put)
        
        .make(sd => {
            _.mapObject(sd.json, (value, key) => {
                self[key] = value
            })
        })

        // finished
        .end(done, self)
})

const _validate = f => _.is.Function(f) && _.is.Dictionary(f.produces)
_validate.method = "_.is.Function(f) && _.is.Dictionary(f.produces)"

execute.method = "execute"
execute.description = ``
execute.requires = {
    rule: {
        key: _.is.String,
        values: [ _.is.Array, _.is.String ],
        method: _validate,
    },
}
execute.accepts = {
    cache: {
        put: _.is.Function,
        get: _.is.Function,
    },
}
execute.produces = {
}

/**
 *  API
 */
exports.execute = execute
