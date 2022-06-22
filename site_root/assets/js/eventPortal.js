var catIndex = Object()

var allevents = [["Apple",["Food","Orange","Black","Fitness","Round","Square","Prack","Sack","Prack","Sack","Lack","Fitness","Brick","Sound","Event","Boring","Good",
"Bad","Something","This is good","This is not","Another","Yet Another","Yellow"]],["Run",["Exersize","Fitness"]],["Cheese",["Food","Fitness"]],["Cat",["Exersize","Fitness"]]
,["cheeta",["Exersize","Fitness"]],["parakeet",["Exersize","Fitness"]],["Dog",["Sack","Fitness"]]];

allevents.sort((a,b)=>{
    a1 = a[0].toLowerCase()
    b1 = b[0].toLowerCase()
    if(a1<b1) return -1;
    if(a1>b1) return 1;
    return 0});

console.log(allevents);

var eventSearchSubset = allevents;

$("#EveEdit #exit").click(()=>{
    $("#EveEdit").addClass("invisable")
})

$("#createEvent").click(()=>{
    $("#EveEdit").removeClass("invisable")
})

$("#eventin").keyup(()=>{
    let val = $("#eventin").val();
    val = val.toLowerCase()
    let i = 0;
    val+="a";
    while(allevents[i][0].toLowerCase()<val){
        removeEventButtons([i]);
        ++i;
        if(allevents.length<=i) return;
    }
  
    val =  val.slice(0,-1);
    while(allevents[i][0].toLowerCase().slice(0,val.length)==val){ addEventButtons([i]);
        ++i;
        if(allevents.length<=i) return;
    }
    while(allevents.length>i){
        removeEventButtons([i]);
        ++i;
    }




});


function genCatIndex(){
    for(let i = 0; i<allevents.length; ++i){
        allevents[i][1].forEach(c=>{
            if(!(c in catIndex)) catIndex[c] = [false,[]]; // sets all categories to inactive
            catIndex[c][1].push(i)
        });
    }
}

genCatIndex();
populateCatButtons(catIndex);
populateEventButtons(eventSearchSubset);



$("optbutton").click(function () { //Info Circle if Clicked Function, toggles Message Box and Time Stamps for Debounce
    $(this).toggleClass("optbutton-Clicked");
    
});
var catsClickCount = 0;

function createLookupDickFromArr(arr){
    arr.forEach(e=>{})
}

$(".flexbuttons > optbutton").click(function () { //Info Circle if Clicked Function, toggles Message Box and Time Stamps for Debounce
    let id = $(this).attr("id");
    id = id.slice(3)
    if(!(id in catIndex)) console.log("ERROR cat clicked doesnt match known categories");
    if(catIndex[id][0]){ // if toggling to remove cat
        catIndex[id][0] =  false;
        catsClickCount--;
        if(catsClickCount==0){
            temp = [];
            for(k in catIndex){if(k!=id){temp.concat(catIndex[k][1])}}
            addEventButtons(temp);
        }else{removeEventButtons(catIndex[id][1]);}
        
    }else{ // if toggling to add cat
        catIndex[id][0] =  true;
        if(catsClickCount==0){
            temp = [];
            for(k in catIndex){if(k!=id){temp=temp.concat(catIndex[k][1]);}}
            removeEventButtons(temp);
        }else{addEventButtons(catIndex[id][1]);}
        catsClickCount++;
    }
    console.log(catsClickCount)
});

function removeEventButtons(arr){
    console.log(arr)
    arr.forEach(e=>{
        console.log(`#eve${allevents[e][0]}`)
        $(`#eve${allevents[e][0]}`).addClass("invisable")
    });
}
function addEventButtons(arr){
    arr.forEach(e=>{
        $(`#eve${allevents[e][0]}`).removeClass("invisable");
    });
}

function populateCatButtons(dict){
    let i = 1;
    for(var key in dict){
        $(`.flexbuttons:nth-of-type(${i})`).append(`<optbutton class= "optbutton" id=cat${key}>${key}<optbutton/>`)
        i= (i%4)+1;
    }
}

function populateEventButtons(arr){
    let i = 1;
    arr.forEach(e=>{
        $(`#eveselect`).append(`<optbutton class= "optbutton" id=eve${e[0]}>${e[0]}<optbutton/>`)
        i= (i%10)+1;
    });
}