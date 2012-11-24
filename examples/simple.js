var livefeed = require("..")
    , level = require("levelidb")
    , WriteStream = require("write-stream")

    , db = level("/tmp/db-livefeed-example", {
        createIfMissing: true
    })

var stream = livefeed(db, { start: "foo:", end: "foo;" })

stream.pipe(WriteStream(function (chunk) {
    console.log("chunk", chunk.type, chunk.key.toString()
        , chunk.value && chunk.value.toString())
}))

stream.on("loaded", function () {
    console.log("finished loading from disk")
})

setTimeout(function () {
    db.put("foo:some key", "some value")

    db.del("foo:die")

    db.batch([
        { type: "put", key: "foo:one", value: "two" }
        , { type: "del", key: "foo:two" }
    ])
}, 2000)
