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

  var multi = multicore(hypercore, storage, { valueEncoding: 'json' })

  this.kv = umkv(lvl)

  this.index = indexer({
    cores: multi,
    map: function (node, feed, seq, next) {
      var entry = {
        id: feed.key.toString('hex') + '@' + seq,
        key: node.key,
        links: node.links
      }
      self.kv.batch([entry], next)
    }
  })

  this.writer = null
  multi.writer(function (_, w) {
    self.writer = w
  })
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
  this.kv.get(key, function (_, ids) {
    cb(null, ids)
  })
}
