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
const pug=require('pug');

mongoose.Promise = global.Promise;
const connect = mongoose.connect(config.mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true });
connect.then((db) => {
    console.log("Successfully connected to database !!");
}, (err) => console.log(err));

const app = express();

const hostname = 'localhost';
const port = 3000;

app.set('view engine', 'pug');
app.use(express.json());
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

app.get('/', (req, res) => {
    res.statusCode = 200;
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/preview',upload.single('userPhoto'),(req,res)=>{
    console.log(req.file);
    res.render('preview.pug', {
        title: 'Verify Your Details',
        body: JSON.stringify(req.body,null,'\n')  // This is your form data as a JSON object.
      });
});
app.post('/register', (req, res) => {
    
    console.log(req.body);
    var myData = new Part(req.body);
    myData.save()
        .then(item => {
            res.status(200);
            res.setHeader("Content-Type","application/json");
            res.json({message:"Success!"+"\n"+"Note down your Registration No. for future reference."+"\n"+ item._id,success:true});
        })
        .catch(err => {
            res.status(400);
            res.setHeader("Content-Type","application/json");
            res.json({message:"Unable to save to database!", success:false});
        });
});
app.listen(port, hostname, () => {
    console.log(`Server successfully running at http://${hostname}:${port}!!`);
});

