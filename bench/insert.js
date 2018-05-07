var bench = require('nanobench')
var hyperdb = require('hyperdb')
var ram = require('random-access-memory')
var randomBytes = require('randombytes')
var memdb = require('memdb')
var hyperkv = require('../multi-kv')
var tmp = require('tmp').tmpNameSync
var level = require('level')

function hyperdbInsert (db, num, cb) {
  var ops = []
  for (var i = 0; i < num; i++) {
    var key = randomBytes(16).toString('hex')
    var val = randomBytes(32).toString('hex')
    ops.push({
      type: 'put',
      key: key,
      value: val
    })
  }
  db.batch(ops, cb)
}

function multifeedInsert (db, num, cb) {
  db.ready(function () {
    var pending = num
    for (var i = 0; i < num; i++) {
      var key = randomBytes(16).toString('hex')
      var value = randomBytes(32).toString('hex')
      db.put(key, value, done)
    }

    function done () {
      if (--pending) return
      db.index.ready(cb)
    }
  })
}

bench('hyperdb/ram/insert & index 100 keys', function (b) {
  var db = hyperdb(ram, { valueEncoding: 'json' })
  b.start()
  hyperdbInsert(db, 100, function () {
    b.end()
  })
})
bench('hyperdb/ram/insert & index 1000 keys', function (b) {
  var db = hyperdb(ram, { valueEncoding: 'json' })
  b.start()
  hyperdbInsert(db, 1000, function () {
    b.end()
  })
})
bench('hyperdb/ram/insert & index 10000 keys', function (b) {
  var db = hyperdb(ram, { valueEncoding: 'json' })
  b.start()
  hyperdbInsert(db, 10000, function () {
    b.end()
  })
})

bench('hyperdb/disk/insert & index 100 keys', function (b) {
  var db = hyperdb(tmp(), { valueEncoding: 'json' })
  b.start()
  hyperdbInsert(db, 100, function () {
    b.end()
  })
})
bench('hyperdb/disk/insert & index 1000 keys', function (b) {
  var db = hyperdb(tmp(), { valueEncoding: 'json' })
  b.start()
  hyperdbInsert(db, 1000, function () {
    b.end()
  })
})
bench('hyperdb/disk/insert & index 10000 keys', function (b) {
  var db = hyperdb(tmp(), { valueEncoding: 'json' })
  b.start()
  hyperdbInsert(db, 10000, function () {
    b.end()
  })
})

bench('multi-hypercore/ram/insert & index 100 keys', function (b) {
  var db = hyperkv(ram, memdb())
  b.start()
  multifeedInsert(db, 100, function () {
    b.end()
  })
})
bench('multi-hypercore/ram/insert & index 1000 keys', function (b) {
  var db = hyperkv(ram, memdb())
  b.start()
  multifeedInsert(db, 1000, function () {
    b.end()
  })
})
bench('multi-hypercore/ram/insert & index 10000 keys', function (b) {
  var db = hyperkv(ram, memdb())
  b.start()
  multifeedInsert(db, 10000, function () {
    b.end()
  })
})


bench('multi-hypercore/disk/insert & index 100 keys', function (b) {
  var db = hyperkv(tmp(), level(tmp()))
  b.start()
  multifeedInsert(db, 100, function () {
    b.end()
  })
})
bench('multi-hypercore/disk/insert & index 1000 keys', function (b) {
  var db = hyperkv(tmp(), level(tmp()))
  b.start()
  multifeedInsert(db, 1000, function () {
    b.end()
  })
})
bench('multi-hypercore/disk/insert & index 10000 keys', function (b) {
  var db = hyperkv(tmp(), level(tmp()))
  b.start()
  multifeedInsert(db, 10000, function () {
    b.end()
  })
})
