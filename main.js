var express = require('express');
var bodyParser = require('body-parser');
const fs = require("fs");
var helmet = require('helmet');
var session = require('express-session');
var scrap = require("./scrap.js")
var config = JSON.parse(fs.readFileSync("./config.json"));
//let sseExpress = require('sse-express');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

var kolace = [];
var pattern = {};

scrap();
scrap.event.on("loaded", (patternIN, vsetky)=>{
    pattern = patternIN; //JSON.parse(fs.readFileSync("./pattern.json")) || ;
    kolace = vsetky;//JSON.parse(fs.readFileSync('./vsetky.json'));
    console.log(pattern);
})

setInterval(()=>{scrap(); pattern = JSON.parse(fs.readFileSync("pattern.json"));}, 60 * 60 * 8 * 1000);

app.use(helmet());
app.use(session({
    secret: 'afasfsafasfazvxcbgnvhmbjlyhfvhndfgvxc',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json()); //Parses the text as JSON and exposes the resulting object on req.body.
app.use('/data/', express.static('data'));
app.listen(process.env.PORT || 80, ()=>{console.log("server started!!")});
/*
Schema :  Meno, obrazok, popis, input:{pocet}, cena, datum donesenia {HTML CALENDAR}
*/

app.get('/nakup/', (req, res)=>{
    console.log(req.path);
    if(typeof req.session.kosik == "undefined") req.session.kosik = [];
    console.log(req.query);
    let admin = (typeof req.session.admin != "undefined" && req.session.admin != false);
    res.render("nakup", {"kosik": req.session.kosik, "kolace": kolace, "admin": admin, "pattern": pattern, "querry": req.query});
});

app.get('/', (req, res)=>{
    res.render("index", {});
});

app.get('/kosikUp/', (req, res)=> {
    res.render("parts/kosik", {"kosik": req.session.kosik, "kolace": kolace});
});

app.get('/objednavkaUp/', (req, res)=> {
    res.render("objednavka", {"kosik": req.session.kosik, "kolace": kolace});
});


app.post('/addToCart/', (req,res)=>{
    if(typeof req.body.id != "undefined" && typeof req.body.pocet != "undefined" && Math.floor(Number(req.body.pocet)) > 0) {
        if( typeof req.session.kosik != "undefined"){
            var existuje = "nie";
            req.session.kosik.forEach((item, index) => {
                if(item.id == req.body.id){
                    existuje = index;
                }
            });
            if(existuje !== "nie"){
                var cislo = Number(req.session.kosik[existuje].pocet);
                req.session.kosik[existuje].pocet = Math.floor(Number(req.body.pocet)) + cislo;
            }
            else{
                req.session.kosik.push({"id": req.body.id, "pocet": Math.floor(Number(req.body.pocet)) });
            }
            
        }
        else{
            req.session.kosik = [{"id": req.body.id, "pocet": Math.floor(Number(req.body.pocet))}];
        }
    }
    res.end();
});

app.post('/remFromCart/', (req,res)=>{
    if(typeof req.body.id != "undefined" && typeof req.body.pocet != "undefined" && Math.floor(Number(req.body.pocet).toFixed(0)) > 0) {
        if( typeof req.session.kosik != "undefined"){
            var existuje = "nie";
            req.session.kosik.forEach((item, index) => {
                if(item.id == req.body.id){
                    existuje = index;
                }
            });
            if(existuje !== "nie"){
                var cislo = Number(req.session.kosik[existuje].pocet);
                req.session.kosik[existuje].pocet = cislo - Math.floor(Number(req.body.pocet));
                if(req.session.kosik[existuje].pocet < 1){
                    req.session.kosik.splice(existuje, 1);
                }
            }       
        }
    }
    res.end();
});

app.get('/kosikPocet/', (req, res)=>{

    res.end(String(req.session.kosik.length));
});

app.get('/nakup/objednavka', (req, res)=>{
    if(typeof req.session.kosik == "undefined") req.session.kosik = [];
    res.render("objednaj", {"kosik": req.session.kosik, "kolace": kolace, "NOkosik": true});
});

app.get("/admin/login/", (req, res)=>{
    res.render("login");
});
app.post("/admin/login/", (req, res)=>{
    if(req.body.name == config.admin.name && req.body.pass == config.admin.pass){
        req.session.admin = true;
        res.redirect("/");
    }
    else{
        res.render("login", {'err': true})
    }
});

app.get("/admin/logout/", (req, res)=>{
    req.session.admin = false;
    res.redirect("/nakup/");
});

app.post("/nakup/", (req, res)=>{  //pre admina
    if(typeof req.session.admin == "undefined" || req.session.admin == false) res.redirect(303, "/nakup/");
    else{
        var found = kolace.findIndex(function(element) {
            return (element.meno == req.body.meno);
        });
        kolace[found].cena = req.body.cena;
        kolace[found].touched = true;
        fs.writeFileSync("./vsetky.json", JSON.stringify(kolace));
        res.redirect(303, "/nakup/");
    }
});