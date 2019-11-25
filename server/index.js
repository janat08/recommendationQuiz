const express = require('express');
var arangojs = require("arangojs");


var db = new arangojs.Database({url: "http://localhost:41567"});
var now = Date.now();
db.query({
    query: "RETURN @value",
    bindVars: { value: now }
})
    .then(function (cursor) {
        console.log('no error')
        return cursor.next().then(function (result) {
            console.log(result)
        });
    })
    .catch(function (err) {
        console.log("err", err.port, err.code, err.syscall)
    });

// let bundler = new Bundler('client/index.html', {watch: true}); 
let app = express();

// app.use(bundler.middleware());
app.listen(5000);