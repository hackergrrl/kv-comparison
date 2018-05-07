# kv comparison

Compares

- `hyperdb`
- `multifeed` + `unordered-materialized-kv`
- `hyperkv` + `hyperlog`

speeds for various operations.

## insertions

| |hyperdb|multifeed|hyperkv|
|---|---|---|---|
|ram/100 keys|94 ms|158 ms|235 ms|
|ram/1000 keys| 585 ms| 644 ms| 1.4 s|
|ram/10000 keys| 2.84| 4.87 s| 14 s|
|disk/100 keys| 87 ms| 220 ms| 515 ms|
|disk/1000 keys| 369 ms| 889 ms| 2.37 s|
|dis/10000 keys| 3.14 s| 7.28 s| 23 s|

## lookups

| |hyperdb|multifeed|hyperkv|
|---|---|---|---|
|ram/1000 keys|376 ms|424 ms| 417 ms|
|disk/1000 keys|380 ms|579 ms| 633 ms|

# license

ISC
