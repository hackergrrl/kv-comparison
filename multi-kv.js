var hypercore = require('hypercore')
var multifeed = require('multifeed')
var indexer = require('multifeed-index')
var umkv = require('unordered-materialized-kv')
var ram = require('random-access-memory')
var memdb = require('memdb')

module.exports = KV

function KV (storage, lvl) {
  if (!(this instanceof KV)) return new KV(storage, lvl)

  var self = this

  this.multi = multifeed(hypercore, storage, { valueEncoding: 'json' })

  this.kv = umkv(lvl)

  this.index = indexer({
    cores: this.multi,
    maxBatch: 100,
    batch: function (nodes, feed, seqs, next) {
      var entries = nodes.map(function (node, n) {
        return {
          id: feed.key.toString('hex') + '@' + seqs[n],
          key: node.key,
          links: node.links
        }
      })
      self.kv.batch(entries, next)
    }
  })

  this.readyToCall = []
  this.writer = null
  this.multi.writer(function (_, w) {
    self.writer = w
    self.readyToCall.forEach(function (fn) {
      fn()
    })
    self.readyToCall = []
  })
}

KV.prototype.ready = function (fn) {
  if (this.writer) process.nextTick(fn)
  else this.readyToCall.push(fn)
}

KV.prototype.put = function (key, value, cb) {
  var entry = {
    key: key,
    value: value,
    links: []  // TODO: use/find prev values + add links
  }
  var w = this.writer
  w.append(entry, function (err) {
    if (err) return cb(err)
    var id = w.key.toString('hex') + '@' + (w.length - 1)
    cb(null, id)
  })
}

KV.prototype.batch = function (ops, cb) {
  var w = this.writer
  w.append(ops, cb)
}

KV.prototype.get = function (key, cb) {
  var self = this

  this.kv.get(key, function (_, ids) {
    var res = []
    var pending = ids.length + 1

    for (var i = 0; i < ids.length; i++) {
      self.getById(ids[i], done)
    }

    done()

    function done (_, entry) {
      pending--
      if (!entry) return
      res.push(entry.value)
      if (pending) return
      cb(null, res)
    }
  })
}

// id = "key@seq"
KV.prototype.getById = function (id, cb) {
  var feedkey = id.split('@')[0]
  var feedseq = Number(id.split('@')[1])
  var feed = this.multi.feed(new Buffer(feedkey, 'hex'))
  if (feed) {
    feed.get(feedseq, cb)
  } else {
    process.nextTick(cb, {notFound:true})
  }
}
