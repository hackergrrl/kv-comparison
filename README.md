# kv comparison

Compares `hyperdb` to `multi-hypercore` + unordered-materialized-kv` speed for
various operations.

## insertions

```
# hyperdb/ram/insert & index 100 keys
ok ~169 ms (0 s + 168947589 ns)

# hyperdb/ram/insert & index 1000 keys
ok ~1.27 s (1 s + 267883227 ns)

# hyperdb/ram/insert & index 10000 keys
ok ~6.28 s (6 s + 284048380 ns)

# hyperdb/disk/insert & index 100 keys
ok ~138 ms (0 s + 137993549 ns)

# hyperdb/disk/insert & index 1000 keys
ok ~1.18 s (1 s + 180369442 ns)

# hyperdb/disk/insert & index 10000 keys
ok ~10 s (10 s + 117884361 ns)

# multi-hypercore/ram/insert & index 100 keys
ok ~121 ms (0 s + 121406460 ns)

# multi-hypercore/ram/insert & index 1000 keys
ok ~1.1 s (1 s + 95401536 ns)

# multi-hypercore/ram/insert & index 10000 keys
ok ~6.51 s (6 s + 514959403 ns)

# multi-hypercore/disk/insert & index 100 keys
ok ~329 ms (0 s + 328634711 ns)

# multi-hypercore/disk/insert & index 1000 keys
ok ~2.08 s (2 s + 81349481 ns)

# multi-hypercore/disk/insert & index 10000 keys
ok ~13 s (12 s + 992249729 ns)
```

## lookups

```
# hyperdb/ram/lookup 1000 keys vs 1000 entries
ok ~364 ms (0 s + 363649039 ns)

# hyperdb/disk/lookup 1000 keys vs 1000 entries
ok ~399 ms (0 s + 398849674 ns)

# multi-hypercore/ram/lookup 1000 keys vs 1000 entries
ok ~430 ms (0 s + 430498097 ns)

# multi-hypercore/disk/lookup 1000 keys vs 1000 entries
ok ~552 ms (0 s + 552186751 ns)

```

# license

ISC
