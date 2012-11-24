var ReadStream = require("read-stream")
    , WriteStream = require("write-stream")
    , wrap = require("streams2")

module.exports = query

function query(db, options) {
    options = options || {}

    var queue = ReadStream()
        , stream = queue.stream
        , start = options.start
        , end = options.end
        , writer = WriteStream(write, loaded)
        , reader = wrap(db.readStream(options))

    reader.pipe(writer)

    db.on("put", put)
    db.on("del", del)
    db.on("batch", batch)
    stream.close = stream.destroy = close

    return stream

    function write(chunk) {
        chunk.type = "put"
        queue.push(chunk)
    }

    function loaded() {
        stream.emit("loaded")
        this.emit("finish")
    }

    function put(key, value) {
        key = key.toString()
        if ((!start || start <= key) &&
            (!end || key <= end)
        ) {
            queue.push({ type: "put", key: key , value: value })
        }
    }

    function del(key) {
        key = key.toString()
        if ((!start || start <= key) &&
            (!end || key <= end)
        ) {
            queue.push({ type: "del", key: key })
        }
    }

    function batch(args) {
        args.forEach(function (item) {
            var key = item.key.toString()

            if ((!start || start <= key) &&
                (!end || key <= end)
            ) {
                return queue.push(item)
            }
        })
    }

    function close() {
        reader.unpipe(writer)
        db.removeListener("put", put)
        db.removeListener("del", del)
        db.removeListener("batch", batch)
        queue.end()
    }
}
