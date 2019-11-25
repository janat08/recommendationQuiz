const express = require('express');
require('./db.js')


// let bundler = new Bundler('client/index.html', {watch: true}); 
let app = express();

// app.use(bundler.middleware());
app.listen(5000);