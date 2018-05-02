var bench = require('nanobench')
var ram = require('random-access-memory')
var memdb = require('memdb')
var randomBytes = require('randombytes')
var hyperkv = require('../multi-kv')

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
