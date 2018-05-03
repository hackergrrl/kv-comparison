var hypercore = require('hypercore')
var multicore = require('multi-hypercore')
var indexer = require('multi-hypercore-index')
var umkv = require('unordered-materialized-kv')
var ram = require('random-access-memory')
var memdb = require('memdb')

module.exports = KV

function KV (storage, lvl) {
  if (!(this instanceof KV)) return new KV(storage, lvl)

  var self = this

  this.multi = multicore(hypercore, storage, { valueEncoding: 'json' })

  this.kv = umkv(lvl)

  this.index = indexer({
    cores: this.multi,
    map: function (node, feed, seq, next) {
      var entry = {
        id: feed.key.toString('hex') + '@' + seq,
        key: node.key,
        links: node.links
      }
      self.kv.batch([entry], next)
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
  var feeds = this.multi.feeds()
  for (var i = 0; i < feeds.length; i++) {
    if (feeds[i].key.toString('hex') == feedkey) {
      feeds[i].get(feedseq, cb)
      return
    }
  }
  process.nextTick(cb, {notFound:true})
}
