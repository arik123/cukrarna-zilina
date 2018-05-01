function rem(pocet, id) {
    xhr = new XMLHttpRequest();

    xhr.open('POST', '/remFromCart');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
        loadObjednavka();
    };
    xhr.send(encodeURI('id=' + id + "&pocet=" + pocet)); 
}

function loadObjednavka(){
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
           if (xmlhttp.status == 200) {
               document.getElementById("objednavka").innerHTML = xmlhttp.responseText;
           }
           else if (xmlhttp.status == 400) {
              alert('There was an error 400');
           }
           else {
               alert('something else other than 200 was returned');
           }
        }
    };

    xmlhttp.open("GET", "/objednavkaUp", true);
    xmlhttp.send();
}