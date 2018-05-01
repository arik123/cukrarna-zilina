var express = require('express');
var bodyParser = require('body-parser');
const fs = require("fs");
var helmet = require('helmet');
var session = require('express-session');
var scrap = require("./scrap.js")
//let sseExpress = require('sse-express');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

scrap();
setInterval(()=>{scrap()}, 60 * 60 * 8 * 1000);

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
app.get('/nakup', (req, res)=>{
    if(typeof req.session.kosik == "undefined") req.session.kosik = [];
    var kolace = JSON.parse(fs.readFileSync('./vsetky.json'));
    res.render("nakup", {"kosik": req.session.kosik, "kolace": kolace});
});
app.get('/', (req, res)=>{
    res.render("index", {});
});

app.get('/kosikUp/', (req, res)=> {
    var kolace = JSON.parse(fs.readFileSync('./vsetky.json'));
    res.render("parts/kosik", {"kosik": req.session.kosik, "kolace": kolace});
});

app.get('/objednavkaUp/', (req, res)=> {
    var kolace = JSON.parse(fs.readFileSync('./vsetky.json'));
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
    var kolace = JSON.parse(fs.readFileSync('./vsetky.json'));
    res.render("objednaj", {"kosik": req.session.kosik, "kolace": kolace, "NOkosik": true});
});