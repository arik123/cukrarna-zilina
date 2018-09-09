var lastWritableElement = null;
var kosikON = false;
var dontRegisterClick = false;

document.addEventListener("click", function(event) { 
    var path = event.path || (event.composedPath && event.composedPath()) || composedPath(event.target);
    var isKosik = (containId(path, "kosik") && !( (path[0].id == "kosik" || (path[0].tagName == "IMG" && path[1].id == "kosik")) && kosikON) );
    console.log(path);
    console.log(isKosik);
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
});



// helpers

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


function containId(path, find){
    var found = false;
    path.forEach((element)=>{
        if(typeof element.id != "undefined" && element.id == find) {
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