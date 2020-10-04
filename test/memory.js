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
                    sd.key = "key-1"
                    sd.json = {
                        "tokens": [ "a", "b", "c" ]
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
    })
    describe("memory.get", function() {
        it("memory.put - works", function(done) {
            _.promise(self)
                .then(cache.memory.initialize)

                .make(sd => {
                    sd.key = "key-1"
                    sd.json = {
                        "tokens": [ "a", "b", "c" ]
                    }
                })
                .then(cache.memory.put)
                .make(sd => {
                    delete sd.json
                })
                .then(cache.memory.get)
                .then(sd => {
                    const want = {
                        "tokens": [ "a", "b", "c" ],
                    }
                    const got = sd.json

                    assert.deepEqual(got, want)
                })

                .end(done, {})
        })
    })
})
