module.exports = scrap;

var events = require('events');
var eventEmitter = new events.EventEmitter();

const https = require('https');
var fs = require('fs');

var ended = 0;
var pocet = 0;
var vsetky = [];
var cats = [];
var stare = [];
if (fs.existsSync("./vsetky.json")) {
    stare = JSON.parse(fs.readFileSync("./vsetky.json"));
}


console.log(Array.isArray(stare));

function scrap(){

    if (!fs.existsSync("./cashe")){
        fs.mkdirSync("./cashe");
    }

    https.get('https://dsystem.synapse5.com/katalog-dortu/?kategorie=19', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        var reg = /<a href="(.*?)">([\s\S]*?)<\/a>/g;
        var regLink = /<font[\s\S]*?><strong>([\s\S]*?)<\/strong><\/font>/
        var result;
        var cont;
        while ((result = reg.exec(data)) !== null) {
            if((cont = regLink.exec(result[2])) !== null){
                childSite(result[1], cont[1], ()=>{ended++});
                pocet++;
            }
        }
        wait()
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
}
scrap.event = eventEmitter;

function end() {

    fs.readdir("./cashe", (err, files) => {
        var a = [];
        files.forEach(file => {
            a.push( fs.readFileSync("./cashe/" + file));
        });
        a.forEach((file) => {
            var parsed = JSON.parse(file);
            parsed.forEach((jedenKolac) => {
                vsetky.push(jedenKolac)
            })
            
        })
        fs.writeFileSync("./vsetky.json", JSON.stringify(vsetky));
        fs.writeFileSync("./pattern.json", JSON.stringify({"category": cats}));
    })
    console.log("scrapping finished");
    eventEmitter.emit("loaded", {"category": cats}, vsetky);
}

function wait() {
    if(ended<pocet){
        var waiTout = setTimeout(wait, 1000);
    }
    else end();
}

function childSite(link, catname, callback){
    cats.push(catname);
    https.get(link, (resp) => {
          let data = '';
        
          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk;
          });
        
          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            
            var reg = /<div class="wrapper[\s\S]*?">([\s\S]*?)<\/div>[\s\S]*?<!-- Site footer -->/g;
            var row = /<ul[\s\S]*?>([\s\S]*?)<\/ul>/g;
            //var col = /<li[\s\S]*?>([\s\S]*?)<\/li>/g;
            var col = /<div[\s\S]*?>[\s\S]*?<div[\s\S]*?>[\s\S]*?<div[\s\S]*?>[\s\S]*?<div[\s\S]*?>[\s\S]*?<img[\s\S]*?src="([\s\S]*?)"[\s\S]*?<\/div>[\s\S]*?[\s\S]*?<div[\s\S]*?>[\s\S]*?<h2>([\s\S]*?)<\/h2>[\s\S]*?<p>([\s\S]*?) g<\/p>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g;
            var all = [];
            var result, rows, cols, obsahy;
            /*while ((result = reg.exec(data)) !== null) {
                while ((rows = row.exec(result)) !== null){*/
                    console.log(catname)
                    while ((cols = col.exec(data)) !== null){
                        //console.log("stuck")
                        //console.log(cols[1] + " " +  cols[2] + " " + cols[3])
                        var find = stare.find(function(element){
                            return element.meno ==  cols[2];
                        });
                        if(find){
                            var obrazok = (cols[1] == find.obrazok)? find.obrazok : cols[1];
                            var vaha = (cols[3] == find.vaha)? find.vaha : cols[3];
                            var alergeny = (cols[4] == find.alergeny)? find.alergeny : cols[4];
                            var touched = (find.touched) ? true : false;
                            all.push({"obrazok": obrazok, "meno": cols[2], "vaha": vaha, "alergeny": alergeny, "popis": "zatial nieje popis", "cena": find.cena, "category": catname, "touched": touched});
                        }else{
                            all.push({"obrazok": cols[1], "meno": cols[2], "vaha": cols[3], "alergeny": cols[4], "popis": "zatial nieje popis", "cena": Math.floor(Math.random()*1000)/100, "category": catname, "touched": false});
                        }
                    }
             /*   }
            }*/
            
            console.log(all.length)
            fs.writeFile('./cashe/'+catname+'.json', JSON.stringify(all), (err)=>{if(err) throw err;})
            callback();
          });
        
        }).on("error", (err) => {
          console.log("Error: " + err.message);
        });
}