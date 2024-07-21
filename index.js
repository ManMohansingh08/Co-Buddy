var express = require("express");
var server = express();
var MongoClient = require("mongodb").MongoClient;

var url = "mongodb://localhost:27017/";

server.use(express.urlencoded());

server.get("/jquery", (req, res) => {
    res.sendFile(__dirname + "/node_modules/jquery/dist/jquery.min.js")
})

server.post("/signup", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbObject = db.db("social_media");
        console.log(req.body.email, req.body.password)
        var myObj = {email: req.body.email, password: req.body.password, mobile: req.body.mobile, name: req.body.name, age: req.body.age, img: req.body.img};
        
        dbObject.collection("log").find({'email': myObj.email}).toArray(function(err, result) {
            if (err) throw err;
            var resp = false;
            result.forEach((e)=>{
                if(e.email != myObj.email) {
                    resp = false;
                } else {
                    resp = true;
                }
            })
            if(!resp) {
                dbObject.collection("log").insertOne(myObj, (err, r) => {
                    if(err) throw err;
                    res.json(myObj.email + ' is SignUp Successfully');
                    db.close();
                })
            } else {
                res.send("Email is already useded");
            }
        });
    })
})

server.post("/login", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbObject = db.db("social_media");
        var myObj = {email: req.body.email, pass: req.body.password};
        var resp = false;
        var em = "";
        dbObject.collection("log").find({'email': myObj.email}).toArray(function(err, result) {
            if (err) throw err;
            result.forEach((e)=>{
                console.log(e.email, e.password, myObj.email, myObj.pass);
                if((e.email == myObj.email) && (e.password == myObj.pass)) {
                    resp = true;
                    em = e.email;
                }
            })
            if(!resp) {
                res.json({status: 'no', message: myObj.email + " with Password Not Matched!"});
                db.close();
            } else {
                res.json({status: 'yes', message: "Login Successfully", email: em});
            }
        });
    })
})

server.get("/home/:user", (req, res) => {
    res.sendFile(__dirname + "/Home/index.html");
})

server.get("/home/user/:email", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbObject = db.db("social_media");
        var em = req.params.email;
        var resp = false;
        dbObject.collection("log").find({'email': em}).toArray(function(err, result) {
            console.log(result)
            if (err) throw err;
            result.forEach((e)=>{
                if((e.email == em)) {
                    resp = true;
                } else {
                    resp = false;
                }
            })
            resp ? res.json({status: resp, email: result[0].email, conn: result[0].conn, mob: result[0].mob, name: result[0].name}) : "[]";
            db.close();
        });
    });
})

server.get("/icons/", (req, res) => {
    res.sendFile(__dirname + "/ICONS/" + req.query.name);
})

server.get("/images/", (req, res) => {
    res.sendFile(__dirname + "/IMAGES/" + req.query.name);
})

server.get("/", (req, res) => {
    res.sendFile(__dirname + "/Home/index.html");
})

server.get("/login", (req, res) => {
    res.sendFile(__dirname + "/Auth/Login/index.html")
})

server.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/Auth/Signup/index.html")
})

server.get("/icons/key", (req, res) => {
    res.sendFile(__dirname + "/ICONS/key.svg")
})

server.get("/icons/key-fill", (req, res) => {
    res.sendFile(__dirname + "/ICONS/key-fill.svg")
})

server.get("/icons/person", (req, res) => {
    res.sendFile(__dirname + "/ICONS/person.svg")
})

server.get("/icons/person-fill", (req, res) => {
    res.sendFile(__dirname + "/ICONS/person-fill.svg")
})

server.get("/home/background", (req, res) => {
    res.sendFile(__dirname + "/IMAGES/background.webp")
})

server.get("/home/logo", (req, res) => {
    res.sendFile(__dirname + "/IMAGES/logo.png")
})

server.get("/about", (req, res) => {
    res.send("this is about page")
})

server.get("/home/user/edit/:user", (req, res) => {
    res.sendFile(__dirname + "/User/edit.html")
})

server.get("/style/", (req, res) => {
    res.sendFile(__dirname + "/STYLE.CSS/" + req.query.file)
})

server.get("/home/user/cards/all", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbObject = db.db("social_media");
        dbObject.collection("log").find({}).toArray(function(err, result) {
            console.log(result)
            res.json({data: result});
            db.close();
        });
    });
})

server.listen("1000");