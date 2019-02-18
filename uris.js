module.exports = {
    "port": 3000,
    "https_port": 9909,
    "pidFilePath": "/home/node.pid",
    "get": [
        {
            "url": "/getNews",
            "file": "./controller/newslist.js",
            "func": "getNews"
        }
    ],
    "post": [
        {
            "url": "/getAll",
            "file": "./controller/newslist.js",
            "func": "getAll"
        }
    ]
}