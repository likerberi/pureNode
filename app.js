const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
const port = 4000;
// simple sample for 4000_local

const pug = require('pug');

var storage = multer.diskStorage({
                                    //callback
    destination: function(req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage});
//const upload = multer({dest: 'upload/'});

app.use(bodyParser.urlencoded({extended: false}));
// for req.body
app.set('views', './views');
// default
app.locals.pretty = true;
// prettier!
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/upload', function(req, res) {
    res.render('upload');
})

app.post('/upload', upload.single('userfile'), function(req, res, next) {
    //res.send('uploaded:' + req.file);
    res.send('uploaded:' + req.file.originalname);
})

app.use('/user', express.static('upload'));
// Seeing is believing.

// merge when it goes same path.
app.get(['/topic', '/topic/:id'], function(req, res) {
    //res.render('view');
    fs.readdir('store', function(err, files) {
        if(err) {
            res.status(500).send('Internal Server Err0');
            console.log(err);
        }
        var id = req.params.id;
        if(id) {
            fs.readFile('store/' + id, 'utf8', function(err, data) {
                if(err) {
                    res.status(500).send('Internal Server Err2');
                    console.log(err);
                }
                    //res.send(data);
                res.render('view', 
                    {id:id, topics:files, description:data});
            })
        } else {
            res.render('view', {id:'Hello', topics:files, description:'Click shows you detail'});
        }
    })
})

app.post('/topic', function(req, res) {
    var title = req.body.title;
    var content = req.body.content;
    fs.writeFile('store/' + title, content, function(err) {
        if(err) {
            res.status(500).send('Internal Server Err');
            console.log(err);
        }
        res.redirect('/topic/'+ topic);
    })
    //res.send(req.body.title);
})
app.get('/topic/new', function(req, res) {
    res.render('new');
})
app.get('/', function(req, res){
    res.send('Start');
})
app.listen(port, function(){
    console.log(`Example app is listening on port no. ${port}`);
})