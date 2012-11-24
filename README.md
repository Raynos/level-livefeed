# level-livefeed

Live query a range in leveldb

## Example

You query a range in the database. It will load the range from
    disk and then also add on anything else you put or del from
    it.

It's basically a never ending feed like `tail -f`

```js
var livefeed = require("level-livefeed")
    , level = require("levelidb")

    , db = level("/tmp/db")

var stream = livefeed(db, { start: "foo:", end: "foo;" })
/* stream

    { type: "put", key: keyFromDisk1, value: valueFromDisk1 }
    { type: "put", key: keyFromDisk2, value: valueFromDisk2 }

*/

db.put("some key", "some value")
/* stream
    { type: "put", key: "some key", value: "some value" }
*/

db.del("die")
/* stream
    { type: "del", key: "die" }
*/

db.batch([
    { type: "put", key: "one", value: "two" }
    , { type: "del", key: "two" }
])
/* stream
    { type: "put", key: "one", value: "two" }
    , { type: "del", key: "two" }
*/
```

## Installation

`npm install level-livefeed`

## Contributors

 - Raynos

## MIT Licenced
