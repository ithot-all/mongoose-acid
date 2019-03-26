config = {
    _id: 'app',
    members: [
        { _id: 1, host: 'localhost:27111', priority: 2 },
        { _id: 2, host: 'localhost:27112', priority: 1 },
        { _id: 3, host: 'localhost:27113', arbiterOnly: true }
    ]
}

rs.initiate(config)