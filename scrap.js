module.exports = scrap;

const https = require('https');
var fs = require('fs');

var ended = 0;
var pocet = 0;
var vsetky = [];

function scrap(){



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

function end() {
    fs.readdir("./cashe", (err, files) => {
        var a = [];
        files.forEach(file => {
            a.push( fs.readFileSync("./cashe/" + file));
        });
        a.forEach((file) => {
            var parsed = JSON.parse(file);
            parsed.forEach((jeden) => {
                vsetky.push(jeden)
            })
            
        })
        fs.writeFileSync("./vsetky.json", JSON.stringify(vsetky));
    })
}

function wait() {
    if(ended<pocet){
        var waiTout = setTimeout(wait, 1000);
    }
    else end();
}

function childSite(link, catname, callback){
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
                    console.log((catname == "klasické")? link : catname);
                    while ((cols = col.exec(data)) !== null){
                        //console.log("stuck")
                        //console.log(cols[1] + " " +  cols[2] + " " + cols[3])
                        all.push({"obrazok": cols[1], "meno": cols[2], "vaha": cols[3], "alergeny": cols[4], "popis": "zatial nieje popis", "cena": Math.floor(Math.random()*1000)/100});
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