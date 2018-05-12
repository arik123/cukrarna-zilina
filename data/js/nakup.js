function add(pocet, id, toNull) {
    toNull.value= '';
    xhr = new XMLHttpRequest();

    xhr.open('POST', '/addToCart');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
        loadKosik();
    };
    xhr.send(encodeURI('id=' + id + "&pocet=" + pocet)); 

    var anim = toNull.parentElement.parentElement.children[0];
    var clone = anim.cloneNode(true);
    var rect = anim.getBoundingClientRect();
    clone.style.position = "fixed";
    clone.style.top = rect.top+'px';
    clone.style.left = rect.left+'px';
    clone.className += " animate";
    var res = anim.parentElement;
    res.appendChild(clone);
    setTimeout(()=>{
        res.removeChild(res.lastChild); 
    }, 300);
}

function rem(pocet, id) {
    xhr = new XMLHttpRequest();

    xhr.open('POST', '/remFromCart');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
        loadKosik();
    };
    xhr.send(encodeURI('id=' + id + "&pocet=" + pocet)); 
}

function loadKosik(){
    updatePocet();
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
           if (xmlhttp.status == 200) {
               document.getElementById("vkosiku").innerHTML = xmlhttp.responseText;
           }
           else if (xmlhttp.status == 400) {
              alert('There was an error 400');
           }
           else {
               alert('something else other than 200 was returned');
           }
        }
    };

    xmlhttp.open("GET", "/kosikUp", true);
    xmlhttp.send();
}

function updatePocet() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
           if (xmlhttp.status == 200) {
               if(xmlhttp.responseText > 0) document.getElementById("kosikIMG").innerHTML = '<div id="kosikPocet">' + xmlhttp.responseText + '</div>';
               else document.getElementById("kosikIMG").innerHTML ="";
           }
           else if (xmlhttp.status == 400) {
              alert('There was an error 400');
           }
           else {
               alert('something else other than 200 was returned');
           }
        }
    };

    xmlhttp.open("GET", "/kosikPocet", true);
    xmlhttp.send();
}

 var utcSeconds = 1417903843000,
     d = new Date();
 
$( function() {
    $( "#date" ).datepicker();
    $( "#date" ).datepicker("option", "minDate", tomorrow());
    $( "#date" ).datepicker( "option", "dateFormat", "yy-mm-dd" );
    $( "#date" ).datepicker( "option", "dayNames", ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota" ] );
    $( "#date" ).datepicker( "option", "dayNamesMin", [ "Ne", "Po", "Ut", "St", "Št", "Pi", "So" ] );
    $( "#date" ).datepicker( "option", "firstDay", 1 );
});

function tomorrow() {
    var p2 = new Date().getTime() + (18 * 3600 * 1000 );
    var today = new Date(p2);
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 

    return new Date(yyyy + "-" + mm + "-" + dd);   
}




var kosikON = false
document.onclick = function(event) { 
    var path = event.path || (event.composedPath && event.composedPath()) || composedPath(event.target);
    var isKosik = containClass(path, "kosik");
    if(isKosik){
        if(!kosikON){
            kosikON = true;
            updateKosik(kosikON);
        }
        kosikON = true;
        updateKosik(kosikON);
    }
    else{
        if(kosikON){
            kosikON = false;
            updateKosik(kosikON);
        }
    }
}

function composedPath (el) {

    var path = [];

    while (el) {

        path.push(el);

        if (el.tagName === 'HTML') {

            path.push(document);
            path.push(window);

            return path;
       }

       el = el.parentElement;
    }
}


function containClass(path, find){
    var found = false;
    path.forEach((element)=>{
        if(typeof element.className != "undefined" && element.className == find) {
            found = true;
        }
    });
    return found;
}

function updateKosik(display){
    var vkosiku = document.getElementById("vkosiku");
    if(display)vkosiku.style.display = "block";
    else vkosiku.style.display = "none";
}

function objednaj(){
    var current = window.location.href;
    if(current[current.length-1] != "/") window.location.href = current + "/objednavka";
    else window.location.href = current + "objednavka";
}


/*



 /$$   /$$ /$$$$$$$$ /$$      /$$        /$$$$$$   /$$$$$$  /$$$$$$$  /$$$$$$$$
| $$$ | $$| $$_____/| $$  /$ | $$       /$$__  $$ /$$__  $$| $$__  $$| $$_____/
| $$$$| $$| $$      | $$ /$$$| $$      | $$  \__/| $$  \ $$| $$  \ $$| $$      
| $$ $$ $$| $$$$$   | $$/$$ $$ $$      | $$      | $$  | $$| $$  | $$| $$$$$   
| $$  $$$$| $$__/   | $$$$_  $$$$      | $$      | $$  | $$| $$  | $$| $$__/   
| $$\  $$$| $$      | $$$/ \  $$$      | $$    $$| $$  | $$| $$  | $$| $$      
| $$ \  $$| $$$$$$$$| $$/   \  $$      |  $$$$$$/|  $$$$$$/| $$$$$$$/| $$$$$$$$
|__/  \__/|________/|__/     \__/       \______/  \______/ |_______/ |________/


*/


function filter(element){
    /*
    var computedStyle = window.getComputedStyle(element, null);

    if(computedStyle.backgroundColor == "rgb(210, 23, 34)"){//not selected

        element.style.backgroundColor = "#fff";
        element.style.color = "#d21722";
        
    }
    else{// selected
        
        element.style.backgroundColor = "#d21722";
        element.style.color = "#fff";
        
    }
    */

    if(element.dataset.selected == "true"){
        element.dataset.selected = false;
    }
    else{
        element.dataset.selected = true;
    }

    var filter = document.getElementById("filter");
    var query = [];

    for(let i = 0; i < filter.children.length; i++){
        if(filter.children[i].dataset.selected == "true"){
            query.push(filter.children[i].innerHTML);
        }
    }

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
           if (xmlhttp.status == 200) {
               console.log(document.getElementById("list"));
               document.getElementById("list").innerHTML = xmlhttp.responseText;
           }
           else if (xmlhttp.status == 400) {
              alert('There was an error 400');
           }
           else {
               alert('something else other than 200 was returned');
           }
        }
    };
console.log(JSON.stringify({'ja': query}))
    xmlhttp.open("GET", "/kolace/?"+serialize({'category': query}), true);
    xmlhttp.send();
}


function serialize(obj, prefix) {
    var str = [],
      p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push((v !== null && typeof v === "object") ?
          serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  }