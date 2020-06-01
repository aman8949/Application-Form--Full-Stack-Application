const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config.js');
const Part = require('./models/part');
const multer = require('multer');
const fs = require('fs');

mongoose.Promise = global.Promise;
const connect = mongoose.connect(config.mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true });
connect.then((db) => {
    console.log("Successfully connected to database !!");
}, (err) => console.log(err));

const app = express();

const hostname = 'localhost';
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));
var upload = multer({dest: './public/images'});

app.get('/', (req, res) => {
    res.statusCode = 200;
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/register', upload.single('userPhoto'),(req, res) => {
    var myData = new Part(req.body);
    myData.save()
        .then(item => {
            res.send('Data Received!\n' + JSON.stringify(req.body));
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
})
app.listen(port, hostname, () => {
    console.log(`Server successfully running at http://${hostname}:${port}!!`);
});

