var bench = require('nanobench')
var hyperdb = require('hyperdb')
var ram = require('random-access-memory')
var randomBytes = require('randombytes')
var memdb = require('memdb')
var hyperkv = require('../multi-kv')
var tmp = require('tmp').tmpNameSync
var level = require('level')

bench('hyperdb/ram/insert & index 100 keys', function (b) {
  var db = hyperdb(ram, { valueEncoding: 'json' })

  b.start()

  var pending = 100
  for (var i = 0; i < 100; i++) {
    var key = randomBytes(16).toString('hex')
    var val = randomBytes(32).toString('hex')
    db.put(key, val, done)
  }

  function done () {
    if (--pending) return
    b.end()
  }
})

bench('hyperdb/ram/insert & index 1000 keys', function (b) {
  var db = hyperdb(ram, { valueEncoding: 'json' })

  b.start()

  var pending = 1000
  for (var i = 0; i < 1000; i++) {
    var key = randomBytes(16).toString('hex')
    var val = randomBytes(32).toString('hex')
    db.put(key, val, done)
  }

  function done () {
    if (--pending) return
    b.end()
  }
})

bench('hyperdb/ram/insert & index 10000 keys', function (b) {
  var db = hyperdb(ram, { valueEncoding: 'json' })

  b.start()

  var pending = 10000
  for (var i = 0; i < 10000; i++) {
    var key = randomBytes(16).toString('hex')
    var val = randomBytes(32).toString('hex')
    db.put(key, val, done)
  }

  function done () {
    if (--pending) return
    b.end()
  }
})

bench('hyperdb/disk/insert & index 100 keys', function (b) {
  var db = hyperdb(tmp(), { valueEncoding: 'json' })

  b.start()

  var pending = 100
  for (var i = 0; i < 100; i++) {
    var key = randomBytes(16).toString('hex')
    var val = randomBytes(32).toString('hex')
    db.put(key, val, done)
  }

  function done () {
    if (--pending) return
    b.end()
  }
})

bench('hyperdb/disk/insert & index 1000 keys', function (b) {
  var db = hyperdb(tmp(), { valueEncoding: 'json' })

  b.start()

  var pending = 1000
  for (var i = 0; i < 1000; i++) {
    var key = randomBytes(16).toString('hex')
    var val = randomBytes(32).toString('hex')
    db.put(key, val, done)
  }

  function done () {
    if (--pending) return
    b.end()
  }
})

bench('hyperdb/disk/insert & index 10000 keys', function (b) {
  var db = hyperdb(tmp(), { valueEncoding: 'json' })

  b.start()

  var pending = 10000
  for (var i = 0; i < 10000; i++) {
    var key = randomBytes(16).toString('hex')
    var val = randomBytes(32).toString('hex')
    db.put(key, val, done)
  }

  function done () {
    if (--pending) return
    b.end()
  }
})

bench('multi-hypercore/ram/insert & index 100 keys', function (b) {
  var db = hyperkv(ram, memdb())

  db.ready(function () {
    b.start()

    var pending = 100
    for (var i = 0; i < 100; i++) {
      var key = randomBytes(16).toString('hex')
      var value = randomBytes(32).toString('hex')
      db.put(key, value, done)
    }

    function done () {
      if (--pending) return
      db.index.ready(function () {
        b.end()
      })
    }
  })
})

bench('multi-hypercore/ram/insert & index 1000 keys', function (b) {
  var db = hyperkv(ram, memdb())

  db.ready(function () {
    b.start()

    var pending = 1000
    for (var i = 0; i < 1000; i++) {
      var key = randomBytes(16).toString('hex')
      var value = randomBytes(32).toString('hex')
      db.put(key, value, done)
    }

    function done () {
      if (--pending) return
      db.index.ready(function () {
        b.end()
      })
    }
  })
})

bench('multi-hypercore/ram/insert & index 10000 keys', function (b) {
  var db = hyperkv(ram, memdb())

  db.ready(function () {
    b.start()

    var pending = 10000
    for (var i = 0; i < 10000; i++) {
      var key = randomBytes(16).toString('hex')
      var value = randomBytes(32).toString('hex')
      db.put(key, value, done)
    }

    function done () {
      if (--pending) return
      db.index.ready(function () {
        b.end()
      })
    }
  })
})

bench('multi-hypercore/disk/insert & index 100 keys', function (b) {
  var db = hyperkv(tmp(), level(tmp()))

  db.ready(function () {
    b.start()

    var pending = 100
    for (var i = 0; i < 100; i++) {
      var key = randomBytes(16).toString('hex')
      var value = randomBytes(32).toString('hex')
      db.put(key, value, done)
    }

    function done () {
      if (--pending) return
      db.index.ready(function () {
        b.end()
      })
    }
  })
})

bench('multi-hypercore/disk/insert & index 1000 keys', function (b) {
  var db = hyperkv(tmp(), level(tmp()))

  db.ready(function () {
    b.start()

    var pending = 1000
    for (var i = 0; i < 1000; i++) {
      var key = randomBytes(16).toString('hex')
      var value = randomBytes(32).toString('hex')
      db.put(key, value, done)
    }

    function done () {
      if (--pending) return
      db.index.ready(function () {
        b.end()
      })
    }
  })
})

bench('multi-hypercore/disk/insert & index 10000 keys', function (b) {
  var db = hyperkv(tmp(), level(tmp()))

  db.ready(function () {
    b.start()

    var pending = 10000
    for (var i = 0; i < 10000; i++) {
      var key = randomBytes(16).toString('hex')
      var value = randomBytes(32).toString('hex')
      db.put(key, value, done)
    }

    function done () {
      if (--pending) return
      db.index.ready(function () {
        b.end()
      })
    }
  })
})
