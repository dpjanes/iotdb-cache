/**
 *  test/memory.js
 *
 *  David Janes
 *  IOTDB
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

const cache = require("..")
const _util = require("./_util")

describe("memory", function() {
    const self = {
        cache$cfg: {},
    }

    describe("memory.initialize", function() {
        it("memory.initialize - works", function(done) {
            _.promise(self)
                .then(cache.memory.initialize)

                .end(done, {})
        })
    })

    describe("memory.put", function() {
        it("memory.put - works", function(done) {
            _.promise(self)
                .then(cache.memory.initialize)

                .make(sd => {
                    sd.tokens = [ "a", "b", "c" ]
                    sd.rule = {
                        key: "key-1",
                        values: "tokens",
                    }
                })
                .then(cache.memory.put)
                .make(sd => {
                    const want = {
                        "key-1": {
                            "tokens": [ "a", "b", "c" ],
                        },
                    }
                    const got = sd.cache.memory

                    assert.deepEqual(got, want)
                })

                .end(done, {})
        })
        it("memory.put - expected fail for missing self.value", function(done) {
            _.promise(self)
                .then(cache.memory.initialize)

                .make(sd => {
                    sd.rule = {
                        key: "key-1",
                        values: "xxx",
                    }
                })
                .then(cache.memory.put)
                .then(_util.auto_fail(done))
                .catch(_util.ok_error(done))
        })
        it("memory.put - expected fail for non-JSON value", function(done) {
            _.promise(self)
                .then(cache.memory.initialize)

                .make(sd => {
                    sd.f = () => {},
                    sd.rule = {
                        key: "key-1",
                        values: "f",
                    }
                })
                .then(cache.memory.put)
                .then(_util.auto_fail(done))
                .catch(_util.ok_error(done))
        })
    })
})
