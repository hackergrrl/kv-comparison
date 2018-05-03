# kv comparison

Compares `hyperdb` to `multi-hypercore` + unordered-materialized-kv` speed for
various operations.

## insertions

```
# hyperdb/ram/insert & index 100 keys
ok ~167 ms (0 s + 167297372 ns)

# hyperdb/ram/insert & index 1000 keys
ok ~1.2 s (1 s + 199610583 ns)

# hyperdb/ram/insert & index 10000 keys
ok ~6.11 s (6 s + 109339387 ns)

# multi-hypercore/ram/insert & index 100 keys
ok ~113 ms (0 s + 112769419 ns)

# multi-hypercore/ram/insert & index 1000 keys
ok ~972 ms (0 s + 972246595 ns)

# multi-hypercore/ram/insert & index 10000 keys
ok ~6.45 s (6 s + 453075847 ns)
```

## lookups

```
# hyperdb/ram/lookup 1000 keys vs 1000 entries
ok ~436 ms (0 s + 435908938 ns)

# multi-hypercore/ram/lookup 1000 keys vs 1000 entries
ok ~477 ms (0 s + 476576257 ns)
```

# license

ISC
