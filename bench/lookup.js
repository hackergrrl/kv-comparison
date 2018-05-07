var bench = require('nanobench')
var hyperdb = require('hyperdb')
var ram = require('random-access-memory')
var randomBytes = require('randombytes')
var memdb = require('memdb')
var multikv = require('../multi-kv')
var tmp = require('tmp').tmpNameSync
var level = require('level')
var hyperlog = require('hyperlog')
var hyperkv = require('hyperkv')

bench('hyperdb/ram/lookup 1000 keys vs 1000 entries', function (b) {
  var db = hyperdb(tmp(), { valueEncoding: 'json' })

  var pending = 1000
  var keys = {}
  for (var i = 0; i < 1000; i++) {
    var key = randomBytes(16).toString('hex')
    var val = randomBytes(32).toString('hex')
    keys[key] = val
    db.put(key, val, done)
  }

  function done () {
    if (--pending) return
    b.start()

    ;(function next (n) {
      if (!n) { return b.end() }
      var kk = Object.keys(keys)
      var key = kk[Math.floor(Math.random() * kk.length)]
      var expected = keys[key]
      db.get(key, function (_, nodes) {
        var val = nodes[0].value
        if (expected != val) throw Error('its broke')
        next(--n)
      })
    })(1000)
  }
})

bench('multifeed/ram/lookup 1000 keys vs 1000 entries', function (b) {
  var db = multikv(ram, memdb())

  db.ready(function () {
    var pending = 1000
    var keys = {}
    for (var i = 0; i < 1000; i++) {
      var key = randomBytes(16).toString('hex')
      var val = randomBytes(32).toString('hex')
      keys[key] = val
      db.put(key, val, done)
    }

    function done () {
      if (--pending) return

      db.index.ready(function () {
        b.start()

        ;(function next (n) {
          if (!n) { return b.end() }
          var kk = Object.keys(keys)
          var key = kk[Math.floor(Math.random() * kk.length)]
          var expected = keys[key]
          db.get(key, function (_, values) {
            var val = values[0]
            if (expected != val) throw Error('its broke')
            next(--n)
          })
        })(1000)
      })
    }
  })
})

bench('hyperkv/ram/lookup 1000 keys vs 1000 entries', function (b) {
  var log = hyperlog(memdb(), { valueEncoding: 'json' })
  var db = hyperkv({ log: log, db: memdb() })

  var pending = 1000
  var keys = {}
  for (var i = 0; i < 1000; i++) {
    var key = randomBytes(16).toString('hex')
    var val = randomBytes(32).toString('hex')
    keys[key] = val
    db.put(key, val, done)
  }

  function done () {
    if (--pending) return
    b.start()

    ;(function next (n) {
      if (!n) { return b.end() }
      var kk = Object.keys(keys)
      var key = kk[Math.floor(Math.random() * kk.length)]
      var expected = keys[key]
      db.get(key, function (_, nodes) {
        var val = Object.values(nodes)[0].value
        if (expected != val) throw Error('its broke')
        next(--n)
      })
    })(1000)
  }
})

bench('hyperdb/disk/lookup 1000 keys vs 1000 entries', function (b) {
  var db = hyperdb(ram, { valueEncoding: 'json' })

  var pending = 1000
  var keys = {}
  for (var i = 0; i < 1000; i++) {
    var key = randomBytes(16).toString('hex')
    var val = randomBytes(32).toString('hex')
    keys[key] = val
    db.put(key, val, done)
  }

  function done () {
    if (--pending) return
    b.start()

    ;(function next (n) {
      if (!n) { return b.end() }
      var kk = Object.keys(keys)
      var key = kk[Math.floor(Math.random() * kk.length)]
      var expected = keys[key]
      db.get(key, function (_, nodes) {
        var val = nodes[0].value
        if (expected != val) throw Error('its broke')
        next(--n)
      })
    })(1000)
  }
})

bench('multifeed/disk/lookup 1000 keys vs 1000 entries', function (b) {
  var db = multikv(tmp(), level(tmp()))

  db.ready(function () {
    var pending = 1000
    var keys = {}
    for (var i = 0; i < 1000; i++) {
      var key = randomBytes(16).toString('hex')
      var val = randomBytes(32).toString('hex')
      keys[key] = val
      db.put(key, val, done)
    }

    function done () {
      if (--pending) return

      db.index.ready(function () {
        b.start()

        ;(function next (n) {
          if (!n) { return b.end() }
          var kk = Object.keys(keys)
          var key = kk[Math.floor(Math.random() * kk.length)]
          var expected = keys[key]
          db.get(key, function (_, values) {
            var val = values[0]
            if (expected != val) throw Error('its broke')
            next(--n)
          })
        })(1000)
      })
    }
  })
})

bench('hyperkv/disk/lookup 1000 keys vs 1000 entries', function (b) {
  var log = hyperlog(level(tmp()), { valueEncoding: 'json' })
  var db = hyperkv({ log: log, db: level(tmp()) })

  var pending = 1000
  var keys = {}
  for (var i = 0; i < 1000; i++) {
    var key = randomBytes(16).toString('hex')
    var val = randomBytes(32).toString('hex')
    keys[key] = val
    db.put(key, val, done)
  }

  function done () {
    if (--pending) return
    b.start()

    ;(function next (n) {
      if (!n) { return b.end() }
      var kk = Object.keys(keys)
      var key = kk[Math.floor(Math.random() * kk.length)]
      var expected = keys[key]
      db.get(key, function (_, nodes) {
        var val = Object.values(nodes)[0].value
        if (expected != val) throw Error('its broke')
        next(--n)
      })
    })(1000)
  }
})
