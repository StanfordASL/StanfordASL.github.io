// QuickSearch script for JabRef HTML export 
// Version: 3.0
//
// Copyright (c) 2006-2011, Mark Schenk
//
// This software is distributed under a Creative Commons Attribution 3.0 License
// http://creativecommons.org/licenses/by/3.0/
//
// Features:
// - intuitive find-as-you-type searching
//    ~ case insensitive
//    ~ ignore diacritics (optional)
//
// - search with/without Regular Expressions
// - match BibTeX key
//

// Search settings
var searchAbstract = true;  // search in abstract
var searchReview = true;    // search in review

var noSquiggles = true;     // ignore diacritics when searching
var searchRegExp = false;   // enable RegExp searches


if (window.addEventListener) {
    window.addEventListener("load",initSearch,false); }
else if (window.attachEvent) {
    window.attachEvent("onload", initSearch); }

function initSearch() {
    // check for quick search table and searchfield
    if (!document.getElementById('qs_table')||!document.getElementById('quicksearch')) { return; }

    // load all the rows and sort into arrays
    loadTableData();
    
    //find the query field
    qsfield = document.getElementById('qs_field');

    // previous search term; used for speed optimisation
    prevSearch = '';

    //find statistics location
    stats = document.getElementById('stat');
    setStatistics(-1);
    
    // set up preferences
    initPreferences();

    // shows the searchfield
    document.getElementById('quicksearch').style.display = 'block';
    document.getElementById('qs_field').onkeyup = quickSearch;
}

function loadTableData() {
    // find table and appropriate rows
    searchTable = document.getElementById('qs_table');
    var allRows = searchTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    // split all rows into entryRows and infoRows (e.g. abstract, review, bibtex)
    entryRows = new Array(); infoRows = new Array(); absRows = new Array(); revRows = new Array();

    // get data from each row
    entryRowsData = new Array(); absRowsData = new Array(); revRowsData = new Array(); 
    
    BibTeXKeys = new Array();
    
    for (var i=0, k=0, j=0; i<allRows.length;i++) {
        if (allRows[i].className.match(/entry/)) {
            entryRows[j] = allRows[i];
            entryRowsData[j] = stripDiacritics(getTextContent(allRows[i]));
            allRows[i].id ? BibTeXKeys[j] = allRows[i].id : allRows[i].id = 'autokey_'+j;
            j ++;
        } else {
            infoRows[k++] = allRows[i];
            // check for abstract/review
            if (allRows[i].className.match(/abstract/)) {
                absRows.push(allRows[i]);
                absRowsData[j-1] = stripDiacritics(getTextContent(allRows[i]));
            } else if (allRows[i].className.match(/review/)) {
                revRows.push(allRows[i]);
                revRowsData[j-1] = stripDiacritics(getTextContent(allRows[i]));
            }
        }
    }
    //number of entries and rows
    numEntries = entryRows.length;
    numInfo = infoRows.length;
    numAbs = absRows.length;
    numRev = revRows.length;
}

function quickSearch(){
    
    tInput = qsfield;

    if (tInput.value.length == 0) {
        showAll();
        setStatistics(-1);
        qsfield.className = '';
        return;
    } else {
        t = stripDiacritics(tInput.value);

        if(!searchRegExp) { t = escapeRegExp(t); }
            
        // only search for valid RegExp
        try {
            textRegExp = new RegExp(t,"i");
            closeAllInfo();
            qsfield.className = '';
        }
            catch(err) {
            prevSearch = tInput.value;
            qsfield.className = 'invalidsearch';
            return;
        }
    }
    
    // count number of hits
    var hits = 0;

    // start looping through all entry rows
    for (var i = 0; cRow = entryRows[i]; i++){

        // only show search the cells if it isn't already hidden OR if the search term is getting shorter, then search all
        if(cRow.className.indexOf('noshow')==-1 || tInput.value.length <= prevSearch.length){
            var found = false; 

            if (entryRowsData[i].search(textRegExp) != -1 || BibTeXKeys[i].search(textRegExp) != -1){ 
                found = true;
            } else {
                if(searchAbstract && absRowsData[i]!=undefined) {
                    if (absRowsData[i].search(textRegExp) != -1){ found=true; } 
                }
                if(searchReview && revRowsData[i]!=undefined) {
                    if (revRowsData[i].search(textRegExp) != -1){ found=true; } 
                }
            }
            
            if (found){
                cRow.className = 'entry show';
                hits++;
            } else {
                cRow.className = 'entry noshow';
            }
        }
    }

    // update statistics
    setStatistics(hits)
    
    // set previous search value
    prevSearch = tInput.value;
}


// Strip Diacritics from text
// http://stackoverflow.com/questions/990904/javascript-remove-accents-in-strings

// String containing replacement characters for stripping accents 
var stripstring = 
    'AAAAAAACEEEEIIII'+
    'DNOOOOO.OUUUUY..'+
    'aaaaaaaceeeeiiii'+
    'dnooooo.ouuuuy.y'+
    'AaAaAaCcCcCcCcDd'+
    'DdEeEeEeEeEeGgGg'+
    'GgGgHhHhIiIiIiIi'+
    'IiIiJjKkkLlLlLlL'+
    'lJlNnNnNnnNnOoOo'+
    'OoOoRrRrRrSsSsSs'+
    'SsTtTtTtUuUuUuUu'+
    'UuUuWwYyYZzZzZz.';

function stripDiacritics(str){

    if(noSquiggles==false){
        return str;
    }

    var answer='';
    for(var i=0;i<str.length;i++){
        var ch=str[i];
        var chindex=ch.charCodeAt(0)-192;   // Index of character code in the strip string
        if(chindex>=0 && chindex<stripstring.length){
            // Character is within our table, so we can strip the accent...
            var outch=stripstring.charAt(chindex);
            // ...unless it was shown as a '.'
            if(outch!='.')ch=outch;
        }
        answer+=ch;
    }
    return answer;
}

// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
// NOTE: must escape every \ in the export code because of the JabRef Export...
function escapeRegExp(str) {
  return str.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function toggleInfo(articleid,info) {

    var entry = document.getElementById(articleid);
    var abs = document.getElementById('abs_'+articleid);
    var rev = document.getElementById('rev_'+articleid);
    var bib = document.getElementById('bib_'+articleid);
    
    if (abs && info == 'abstract') {
        abs.className.indexOf('noshow') == -1?abs.className = 'abstract noshow':abs.className = 'abstract show';
    } else if (rev && info == 'review') {
        rev.className.indexOf('noshow') == -1?rev.className = 'review noshow':rev.className = 'review show';
    } else if (bib && info == 'bibtex') {
        bib.className.indexOf('noshow') == -1?bib.className = 'bibtex noshow':bib.className = 'bibtex show';
    } else { 
        return;
    }

    // check if one or the other is available
    var revshow; var absshow; var bibshow;
    (abs && abs.className.indexOf('noshow') == -1)? absshow = true: absshow = false;
    (rev && rev.className.indexOf('noshow') == -1)? revshow = true: revshow = false;    
    (bib && bib.className.indexOf('noshow') == -1)? bibshow = true: bibshow = false;
    
    // highlight original entry
    if(entry) {
        if (revshow || absshow || bibshow) {
        entry.className = 'entry highlight show';
        } else {
        entry.className = 'entry show';
        }
    }
    
    // When there's a combination of abstract/review/bibtex showing, need to add class for correct styling
    if(absshow) {
        (revshow||bibshow)?abs.className = 'abstract nextshow':abs.className = 'abstract';
    } 
    if (revshow) {
        bibshow?rev.className = 'review nextshow': rev.className = 'review';
    }   
    
}

function setStatistics (hits) {
    if(hits < 0) { hits=numEntries; }
    if(stats) { stats.firstChild.data = hits + '/' + numEntries}
}

function getTextContent(node) {
    // Function written by Arve Bersvendsen
    // http://www.virtuelvis.com
    
    if (node.nodeType == 3) {
    return node.nodeValue;
    } // text node
    if (node.nodeType == 1 && node.className != "infolinks") { // element node
    var text = [];
    for (var chld = node.firstChild;chld;chld=chld.nextSibling) {
        text.push(getTextContent(chld));
    }
    return text.join("");
    } return ""; // some other node, won't contain text nodes.
}

function showAll(){
    closeAllInfo();
    for (var i = 0; i < numEntries; i++){ entryRows[i].className = 'entry show'; }
}

function closeAllInfo(){
    for (var i=0; i < numInfo; i++){
        if (infoRows[i].className.indexOf('noshow') ==-1) {
            infoRows[i].className = infoRows[i].className + ' noshow';
        }
    }
}

function clearQS() {
    qsfield.value = '';
    showAll();
}

function redoQS(){
    showAll();
    quickSearch(qsfield);
}

function updateSetting(obj){
    var option = obj.id;
    var checked = obj.value;

    switch(option)
     {
     case "opt_searchAbs":
       searchAbstract=!searchAbstract;
       redoQS();
       break;
     case "opt_searchRev":
       searchReview=!searchReview;
       redoQS();
       break;
     case "opt_useRegExp":
       searchRegExp=!searchRegExp;
       redoQS();
       break;
     case "opt_noAccents":
       noSquiggles=!noSquiggles;
       loadTableData();
       redoQS();
       break;
     }
}

function initPreferences(){
    if(searchAbstract){document.getElementById("opt_searchAbs").checked = true;}
    if(searchReview){document.getElementById("opt_searchRev").checked = true;}
    if(noSquiggles){document.getElementById("opt_noAccents").checked = true;}
    if(searchRegExp){document.getElementById("opt_useRegExp").checked = true;}
    
    if(numAbs==0) {document.getElementById("opt_searchAbs").parentNode.style.display = 'none';}
    if(numRev==0) {document.getElementById("opt_searchRev").parentNode.style.display = 'none';} 
}

function toggleSettings(){
    var togglebutton = document.getElementById('showsettings');
    var settings = document.getElementById('settings');
    
    if(settings.className == "hidden"){
        settings.className = "show";
        togglebutton.innerText = "close settings";
        togglebutton.textContent = "close settings";
    }else{
        settings.className = "hidden";
        togglebutton.innerText = "settings...";     
        togglebutton.textContent = "settings...";
    }
}

/* Start of search button functionality. (c) Federico Rossi. CC-Attribution 3.0 */

var ShowSearch = document.getElementById('showjabrefsearch'); // Assumes element with id='button'

ShowSearch.onclick = function() {
    var jrdiv = document.getElementById('jrsearchdiv');
    if (jrdiv.style.display !== 'none') {
        jrdiv.style.display = 'none';
        ShowSearch.className = "fa fa-search-plus";
        clearQS();
    }
    else {
        jrdiv.style.display = 'block';
        ShowSearch.className = "fa fa-search-minus";
        document.getElementById("qs_field").focus();
    }
};