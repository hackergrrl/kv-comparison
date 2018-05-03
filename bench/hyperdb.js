var bench = require('nanobench')
var hyperdb = require('hyperdb')
var ram = require('random-access-memory')
var randomBytes = require('randombytes')

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

bench('hyperdb/ram/lookup 1000 keys vs 1000 entries', function (b) {
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
