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

    _.promise(self)
        .make(sd => {
            sd.key = sd.rule.key
            delete sd.value
        })

        // get cached value 
        .then(self.cache.get)

        // if have a cached value, unpack and we're done
        .make(sd => {
            if (!_.is.Dictionary(sd.value)) {
                return
            }

            _util.split(sd.rule.values).forEach(value_key => {
                self[value_key] = sd.value[value_key]
            })

            _.promise.bail(sd)
        })

        // run the cache method
        .then(self.rule.method)

        // store the cached values 
        .make(sd => {
            sd.key = sd.rule.key
            sd.value = {}

            _util.split(sd.rule.values).forEach(value_key => {
                assert.ok(_.is.JSON(sd[value_key]), 
                    `${execute.method}: only JSON values can be cached (key: "${value_key}")`)
                sd.value[value_key] = sd[value_key]

                // to pass through result!
                self[value_key] = sd[value_key]
            })
        })
        .then(self.cache.put)

        // finished
        .end(done, self)
})

execute.method = "execute"
execute.description = ``
execute.requires = {
    rule: {
        key: _.is.String,
        values: [ _.is.Array, _.is.String ],
        method: _.is.Function,
    },
}
execute.accepts = {
    cache: _.is.Dictionary,
}
execute.produces = {
}

/**
 *  API
 */
exports.execute = execute
