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
    var ops = []
    for (var i = 0; i < num; i++) {
      var key = randomBytes(16).toString('hex')
      var value = randomBytes(32).toString('hex')
      ops.push({
        key: key,
        value: value,
        links: []
      })
    }
    db.batch(ops, function () {
      db.index.ready(cb)
    })
  })
}

function hyperkvInsert (db, num, cb) {
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

bench('multifeed/ram/insert & index 100 keys', function (b) {
  var db = multikv(ram, memdb())
  b.start()
  multifeedInsert(db, 100, function () {
    b.end()
  })
})
bench('multifeed/ram/insert & index 1000 keys', function (b) {
  var db = multikv(ram, memdb())
  b.start()
  multifeedInsert(db, 1000, function () {
    b.end()
  })
})
bench('multifeed/ram/insert & index 10000 keys', function (b) {
  var db = multikv(ram, memdb())
  b.start()
  multifeedInsert(db, 10000, function () {
    b.end()
  })
})


bench('multifeed/disk/insert & index 100 keys', function (b) {
  var db = multikv(tmp(), level(tmp()))
  b.start()
  multifeedInsert(db, 100, function () {
    b.end()
  })
})
bench('multifeed/disk/insert & index 1000 keys', function (b) {
  var db = multikv(tmp(), level(tmp()))
  b.start()
  multifeedInsert(db, 1000, function () {
    b.end()
  })
})
bench('multifeed/disk/insert & index 10000 keys', function (b) {
  var db = multikv(tmp(), level(tmp()))
  b.start()
  multifeedInsert(db, 10000, function () {
    b.end()
  })
})

bench('hyperkv/ram/insert & index 100 keys', function (b) {
  var log = hyperlog(memdb(), { valueEncoding: 'json' })
  var db = hyperkv({ log: log, db: memdb() })
  b.start()
  hyperkvInsert(db, 100, function () {
    db.dex.ready(function () {
      b.end()
    })
  })
})
bench('hyperkv/ram/insert & index 1000 keys', function (b) {
  var log = hyperlog(memdb(), { valueEncoding: 'json' })
  var db = hyperkv({ log: log, db: memdb() })
  b.start()
  hyperkvInsert(db, 1000, function () {
    db.dex.ready(function () {
      b.end()
    })
  })
})
bench('hyperkv/ram/insert & index 10000 keys', function (b) {
  var log = hyperlog(memdb(), { valueEncoding: 'json' })
  var db = hyperkv({ log: log, db: memdb() })
  b.start()
  hyperkvInsert(db, 10000, function () {
    db.dex.ready(function () {
      b.end()
    })
  })
})

bench('hyperkv/disk/insert & index 100 keys', function (b) {
  var log = hyperlog(level(tmp()), { valueEncoding: 'json' })
  var db = hyperkv({ log: log, db: level(tmp()) })
  b.start()
  hyperkvInsert(db, 100, function () {
    db.dex.ready(function () {
      b.end()
    })
  })
})
bench('hyperkv/disk/insert & index 1000 keys', function (b) {
  var log = hyperlog(level(tmp()), { valueEncoding: 'json' })
  var db = hyperkv({ log: log, db: level(tmp()) })
  b.start()
  hyperkvInsert(db, 1000, function () {
    db.dex.ready(function () {
      b.end()
    })
  })
})
bench('hyperkv/disk/insert & index 10000 keys', function (b) {
  var log = hyperlog(level(tmp()), { valueEncoding: 'json' })
  var db = hyperkv({ log: log, db: level(tmp()) })
  b.start()
  hyperkvInsert(db, 10000, function () {
    db.dex.ready(function () {
      b.end()
    })
  })
})
