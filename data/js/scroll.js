var scrollAdded=false;

var style = (function() {
    // Create the <style> tag
    var style = document.createElement("style");

    // WebKit hack
    style.appendChild(document.createTextNode(""));

    // Add the <style> element to the page
    document.head.appendChild(style);
  
    //console.log(style.sheet.cssRules); // length is 0, and no rules

    return style;
})();

var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);


window.addEventListener('scroll', ()=>{
    if(w <= 600) {
        console.log(w)
    }
    else{
        scroll = window.scrollY;
        if(scroll == 0 && scrollAdded){
            while(style.sheet.cssRules.length > 0){
                style.sheet.deleteRule(0);
            }
            scrollAdded = false
        }
        else if(scroll != 0 && !scrollAdded){
            style.sheet.insertRule('#header{height:40px !important;}', 0);
            style.sheet.insertRule('#znak{max-height: 40px !important;}', 0);
            style.sheet.insertRule('#linky{height: 40px !important;}', 0);
            style.sheet.insertRule('.headButton{margin-top:1px !important; margin-bottom:1px !important; !important; padding:5px !important;}', 0);
            style.sheet.insertRule('.headLink{margin-top:1px !important; margin-bottom:1px !important; padding:5px !important;}', 0);
            style.sheet.insertRule('@media(min-width: 620px) { #vkosiku{top: 40px !important; } }', 0);
            
            scrollAdded=true;
        }
    }
});