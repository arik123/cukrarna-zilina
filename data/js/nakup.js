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


var lastWritableElement = null;
var kosikON = false;
var dontRegisterClick = false;

document.addEventListener("click", function(event) { 
    if(dontRegisterClick){
        dontRegisterClick = false;
        return;
    }
    var path = event.path || (event.composedPath && event.composedPath()) || composedPath(event.target);
    var isWritable = (path[0] == lastWritableElement);
    if(!isWritable){
        if(lastWritableElement!= null){
            makeWritable(lastWritableElement, false);
        }
    }
})



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
               //console.log(document.getElementById("list"));
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
//console.log(JSON.stringify({'ja': query}))
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

function writeON(element, e){
    dontRegisterClick = true;
    makeWritable(element, true);
}

function makeWritable(element, writable) {
    if(writable){
        let newElement = document.createElement("input");
        newElement.classList.add("counterDisplay");
        newElement.type = 'number';
        newElement.value=element.dataset.pocet;
        newElement.addEventListener("keyup", function(event) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
              // Trigger the button element with a click
              makeWritable(this, false)
            }
          });
          newElement.addEventListener("click", function() {
            this.select();
          });
        element.parentNode.replaceChild(newElement,element);
        lastWritableElement = newElement;
        lastWritableElement.select();
    }
    else{
        let newElement = document.createElement("div");
        newElement.classList.add("counterDisplay");
        newElement.onclick = function(){writeON(this, event)};
        val = Number(element.value);
        if(val < 0) val = 0;
        newElement.dataset.pocet = val;
        newElement.innerHTML = val + "ks";
        element.parentNode.replaceChild(newElement,element);
        lastWritableElement = null;
    }
}

function add(element){
    if(element.parentNode.children[1].tagName.toLowerCase() == "div"){
        element.parentNode.children[1].innerHTML = (Number(element.parentNode.children[1].dataset.pocet) + 1 ) + "ks";
        element.parentNode.children[1].dataset.pocet = (Number(element.parentNode.children[1].dataset.pocet) + 1 );
    }
    else if(element.parentNode.children[1].tagName.toLowerCase() == "input"){
        element.parentNode.children[1].value++;
    }
}

function sub(element){
    if(element.parentNode.children[1].tagName.toLowerCase() == "div"){
        if(Number(element.parentNode.children[1].dataset.pocet) == 0) return;
        element.parentNode.children[1].innerHTML = (Number(element.parentNode.children[1].dataset.pocet) - 1 ) + "ks";
        element.parentNode.children[1].dataset.pocet = (Number(element.parentNode.children[1].dataset.pocet) - 1 );
    }
    else if(element.parentNode.children[1].tagName.toLowerCase() == "input"){
        if(element.parentNode.children[1].value == 0) return;
        element.parentNode.children[1].value--;
    }
}