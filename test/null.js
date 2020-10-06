/**
 *  test/null.js
 *
 *  David Janes
 *  IOTDB
 *  2020-10-06
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

const cache = require("..")
const _util = require("./_util")

describe("null", function() {
    const self = {
        cache$cfg: {},
    }

    describe("null.initialize", function() {
        it("null.initialize - works", function(done) {
            _.promise(self)
                .then(cache.null.initialize)
                .make(sd => {
                    assert.ok(sd.cache)
                })
                .end(done, {})
        })
    })

    describe("null.get", function() {
        it("null.put - works", function(done) {
            _.promise(self)
                .then(cache.null.initialize)

                .make(sd => {
                    sd.key = "key-1"
                    sd.json = {
                        "tokens": [ "a", "b", "c" ]
                    }
                })
                .then(cache.null.put)
                .make(sd => {
                    delete sd.json
                })
                .then(cache.null.get)
                .then(sd => {
                    const want = null
                    const got = sd.json

                    assert.deepEqual(got, want)
                })

                .end(done, {})
        })
    })
})
