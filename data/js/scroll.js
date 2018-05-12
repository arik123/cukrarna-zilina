var scrollAdded=false;

var style = (function() {
    // Create the <style> tag
    var style = document.createElement("style");

    // WebKit hack
    style.appendChild(document.createTextNode(""));

    // Add the <style> element to the page
    document.head.appendChild(style);
  
    console.log(style.sheet.cssRules); // length is 0, and no rules

    return style;
})();




window.addEventListener('scroll', ()=>{


    scroll = window.scrollY;
    if(scroll == 0 && scrollAdded){
        while(style.sheet.cssRules.length > 0){
            style.sheet.deleteRule(0);
        }
        scrollAdded = false
    }
    else if(scroll != 0 && !scrollAdded){
        style.sheet.insertRule('#header{height:40px !important;}', 0);
        style.sheet.insertRule('#znak{max-height: 40px}', 0);
        style.sheet.insertRule('#linky{height: 40px}', 0);
        style.sheet.insertRule('.headButton{margin:1px !important; padding:5px !important;}', 0);
        
        scrollAdded=true;
    }
});