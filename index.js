var ReadStream = require("read-stream")
    , WriteStream = require("write-stream")

module.exports = query

function query(db, options) {
    options = options || {}

    var queue = ReadStream()
        , stream = queue.stream
        , start = options.start
        , end = options.end

    db.readStream(options)
        .pipe(WriteStream(function write(chunk) {
            chunk.type = "put"
            queue.push(chunk)
        }))

    db.on("put", function put(key, value) {
        if (start < key && key < end) {
            queue.push({ type: "put", key: key, value: value })
        }
    })

    db.on("del", function del(key) {
        if (start < key && key < end) {
            queue.push({ type: "del", key: key })
        }
    })

    return stream
}
