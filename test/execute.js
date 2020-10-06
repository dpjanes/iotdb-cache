/**
 *  test/execute.js
 *
 *  David Janes
 *  IOTDB
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
const fs = require("iotdb-fs")

const assert = require("assert")

const cache = require("..")
const _util = require("./_util")

describe("execute", function() {
    describe("memory", function() {
        const self = {
            cache$cfg: {},
        }

        let _called = false
        const _make_tokens = _.promise(self => {
            self.tokens = [ "a", "b", "c" ]
            _called = true
        })

        it("execute - passes through values", function(done) {
            _.promise(self)
                .then(cache.memory.initialize)
                .make(sd => {
                    sd.rule = {
                        key: "key-1",
                        values: "tokens",
                        method: _make_tokens,
                    }
                    _called = false
                })
                .then(cache.execute)
                .make(sd => {
                    const want = [ "a", "b", "c" ]
                    const got = sd.tokens

                    assert.deepEqual(got, want)
                    assert.ok(_called)
                })

                .end(done, {})
        })
        it("execute - actually caches", function(done) {
            _.promise(self)
                .then(cache.memory.initialize)
                .make(sd => {
                    sd.rule = {
                        key: "key-1",
                        values: "tokens",
                        method: _make_tokens,
                    }
                    _called = false
                })
                .then(cache.execute)
                .make(sd => {
                    const want = [ "a", "b", "c" ]
                    const got = sd.tokens

                    assert.deepEqual(got, want)
                    assert.ok(_called)
                })

                // second time
                .make(sd => {
                    _called = false
                })
                .then(cache.execute)
                .make(sd => {
                    const want = [ "a", "b", "c" ]
                    const got = sd.tokens

                    assert.deepEqual(got, want)
                    assert.ok(!_called)
                })

                .end(done, {})
        })
    })
    describe("fs", function() {
        const self = {
            cache$cfg: {
                path: ".fs-cache",
            },
        }

        beforeEach(function(done) {
            _.promise(self)
                .add("cache$cfg/path")
                .then(fs.remove.recursive)
                .end(done, {})
        })

        let _called = false
        const _make_tokens = _.promise(self => {
            self.tokens = [ "a", "b", "c" ]
            _called = true
        })

        it("execute - passes through values", function(done) {
            _.promise(self)
                .then(fs.cache)
                .make(sd => {
                    sd.rule = {
                        key: "key-1",
                        values: "tokens",
                        method: _make_tokens,
                    }
                    _called = false
                })
                .then(cache.execute)
                .make(sd => {
                    const want = [ "a", "b", "c" ]
                    const got = sd.tokens

                    assert.deepEqual(got, want)
                    assert.ok(_called)
                })

                .end(done, {})
        })
        it("execute - actually caches", function(done) {
            _.promise(self)
                .then(fs.cache)
                .make(sd => {
                    sd.rule = {
                        key: "key-1",
                        values: "tokens",
                        method: _make_tokens,
                    }
                    _called = false
                })
                .then(cache.execute)
                .make(sd => {
                    const want = [ "a", "b", "c" ]
                    const got = sd.tokens

                    assert.deepEqual(got, want)
                    assert.ok(_called)
                })

                // second time
                .make(sd => {
                    _called = false
                })
                .then(cache.execute)
                .make(sd => {
                    const want = [ "a", "b", "c" ]
                    const got = sd.tokens

                    assert.deepEqual(got, want)
                    assert.ok(!_called)
                })

                .end(done, {})
        })
    })
    describe("null", function() {
        const self = {
            cache$cfg: {
            },
        }

        let _called = false
        const _make_tokens = _.promise(self => {
            self.tokens = [ "a", "b", "c" ]
            _called = true
        })

        it("execute - passes through values", function(done) {
            _.promise(self)
                .then(cache.null.initialize)
                .make(sd => {
                    sd.rule = {
                        key: "key-1",
                        values: "tokens",
                        method: _make_tokens,
                    }
                    _called = false
                })
                .then(cache.execute)
                .make(sd => {
                    const want = [ "a", "b", "c" ]
                    const got = sd.tokens

                    assert.deepEqual(got, want)
                    assert.ok(_called)
                })

                .end(done, {})
        })
        it("execute - actually caches", function(done) {
            _.promise(self)
                .then(cache.null.initialize)
                .make(sd => {
                    sd.rule = {
                        key: "key-1",
                        values: "tokens",
                        method: _make_tokens,
                    }
                    _called = false
                })
                .then(cache.execute)
                .make(sd => {
                    const want = [ "a", "b", "c" ]
                    const got = sd.tokens

                    assert.deepEqual(got, want)
                    assert.ok(_called)
                })

                // second time
                .make(sd => {
                    _called = false
                })
                .then(cache.execute)
                .make(sd => {
                    const want = [ "a", "b", "c" ]
                    const got = sd.tokens

                    assert.deepEqual(got, want)
                    assert.ok(_called) // note it will be called because there is no cache
                })

                .end(done, {})
        })
    })
})
