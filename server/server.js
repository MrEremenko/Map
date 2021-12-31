const express = require('express');
const http = require('http');
var cors = require('cors');
const save = require('./api/save.js');


var app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/api', save);

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server started on port ${port}`));