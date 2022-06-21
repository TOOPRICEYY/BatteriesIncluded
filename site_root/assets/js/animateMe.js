
var hammertime = new Hammer($('#MainBlock')[0]);

allBoxes = $(".Choices a");





{//init 
    ChoiceModule(true);

    hammertime.on("swipeleft", function (ev) { //Touch Screen Functionality

        ShiftButtons(Choices, true);

    });
    hammertime.on("swiperight", function (ev) {
        ShiftButtons(Choices, false);
    });
    $("#one c").text(Choices[IndexPos]);
    $("#two c").text(Choices[1 + IndexPos]);
    $("#three c").text(Choices[2 + IndexPos]);
    $("#HelpBox").addClass("infoboxdown");
}

    { //Navigation

        { //Info Box Code
            var infodown = true;
            var cooldown = d.getTime() + 1000;
            $("#infocircle").click(function () { //Info Circle if Clicked Function, toggles Message Box and Time Stamps for Debounce
                d = new Date();
                InfoBoxToggle(true);
                cooldown = d.getTime() + 100;

            });

            $("#MainBlock").click(function () { InfoBoxToggle(false) });
            document.addEventListener('keypress', function () {
                InfoBoxToggle(false);
            });
        }

        {//Selection Box Code
            $(".Choices a").click(function () { //Select Boxes Onclick
                box = $(this)
                SelectButton(box);
            });
            document.addEventListener('keypress', (event) => {//number key press functionallity
                const keyName = event.key;

                if (keyName === '1') {
                    SelectButton(Options[0]);

                } if (keyName === '2') {
                    SelectButton(Options[1]);

                }
                if (keyName === '3') {
                    SelectButton(Options[2]);

                }
            }, false);
            document.addEventListener('keydown', (event) => {//arrow keys 
                const keyName = event.keyCode;

                if (keyName == 37) {

                    ShiftButtons(Choices, false);
                }
                if (keyName == 39) {

                    ShiftButtons(Choices, true);


                }
            }, false);

            $(".nav-buttons a.right").click(function () { //Onscreen Navigation Buttons
                loading = true;
                ShiftButtons(Choices, false);



            });
            $(".nav-buttons a.left").click(function () {
                loading = false;



                ShiftButtons(Choices, true);


            });
        }
    }

    function SelectButton(box) { //Selection Function
        var tempIndex = [3];

        if (!loading) {
            if (box.hasClass("selected-good") || box.hasClass("selected-bad")) {
                box.removeClass("selected-good");
                box.removeClass("selected-bad");

            } else if (TestForClass(allBoxes, ("selected-good")) && !TestForClass(allBoxes, ("selected-bad"))) {
                box.addClass("selected-bad");
            } else if (TestForClass(allBoxes, ("selected-bad")) && !TestForClass(allBoxes, ("selected-good"))) {
                box.addClass("selected-good");
            } else if (TestForClass(allBoxes, ("selected-bad"))) {

            }
            else {

                box.addClass("selected-good");
            }
            if (TestForClass(allBoxes, ("selected-bad")) && TestForClass(allBoxes, ("selected-good"))) {



                for (var i = 0; i < 3; i++) {
                    if (Options[i].hasClass("selected-good")) {

                        tempIndex[0] = Choices[IndexPos + i];

                    }
                }
                for (var i = 0; i < 3; i++) {
                    if (Options[i].hasClass("selected-bad")) {


                        tempIndex[2] = Choices[IndexPos + i];

                    }
                }
                for (var i = 0; i < 3; i++) {
                    if (!Options[i].hasClass("selected-bad") && !Options[i].hasClass("selected-good")) {


                        tempIndex[1] = Choices[IndexPos + i];

                    }
                }

                TheChoosenOnes[IndexPos / 3] = tempIndex;

                tempIndex = null;
                ShiftButtons(Choices, true);




            }
        }

    }
    function MoveButtons(labels, direction) { //Code to Shift Text Boxes Content One Over in Either Direction 
        var tempArray;

        if (((labels.length - (IndexPos + 3) < 3) && direction) || (IndexPos < 3 && !direction)) {
            return false;

        } else {
            que++;
            if (que > 10) {
                que = 0;
            }
            var ticket = que;
            if (direction) {

                IndexPos = IndexPos + 3;


            } else {

                IndexPos = IndexPos - 3;
            }

            UpdateButtons();

            $("#one b").text(labels[IndexPos]);
            $("#two b").text(labels[1 + IndexPos]);
            $("#three b").text(labels[2 + IndexPos]);
        }
        if (direction) {
            $(".Choices a b").addClass("FadeIn");
            $(".Choices a c").addClass("FadeOut-Reverse");
        } else {
            $(".Choices a b").addClass("FadeIn-Reverse");
            $(".Choices a c").addClass("FadeOut");
        }

        window.setTimeout(function () { //swap text fields
            if (ticket == que) {

                $("#one c").text(labels[IndexPos]);
                $("#two c").text(labels[1 + IndexPos]);
                $("#three c").text(labels[2 + IndexPos]);
                $(".Choices a b").removeClass("FadeIn");
                $(".Choices a b").removeClass("FadeIn-Reverse");
                $(".Choices a c").removeClass("FadeOut");
                $(".Choices a c").removeClass("FadeOut-Reverse");
            }

        }, 870);

    }

    function ShiftButtons(labels, direction) {  //Calls MoveButtons if conditions are satisfied, Updates Loading Condition, Calculates Questions
        
        if (((labels.length - (IndexPos + 3) < 3) && direction)) {
         
            loading = true;
            Loading(true);
            console.log("OK");
            console.log(TheChoosenOnes);
            TheChoosenOnes = TheChoosenOnes.filter(ele =>{  //TODO ACTUALLY FIX ISSUE 
                if(ele[0]==undefined){
                    console.log("Purged");
                    return false;

                }else{
                    return true;
                }
            });
            
            if(reInit){
                relationshipAdvice.initValues(TheChoosenOnes);
                lengthOfLastInput = TheChoosenOnes.length;
                reInit = false;
            }else if(relationshipAdvice.GetCompletionStatus()==false){
                relationshipAdvice.AddValues(TheChoosenOnes.slice(lengthOfLastInput));
                lengthOfLastInput = TheChoosenOnes.length;
            }
            if(relationshipAdvice.GetCompletionStatus()==false){
            console.log(relationshipAdvice.GetTruthTable());
            MoveButtons(labels.concat(relationshipAdvice.GetNextQuestions()), true);
           
            $("#YourList").html((relationshipAdvice.GetStatus()));
        
            ProgressBar(((relationshipAdvice.GetPercentage()/2)+50));
            console.log(relationshipAdvice.GetNextQuestions());
            Choices = Choices.concat(relationshipAdvice.GetNextQuestions());
             
            Loading(false);
            loading = false;
            }else{
                ProgressBar(100);
                MoveButtons(labels.concat(['done','done','done']), true);
                $("#YourList").html("Your Preference: <br>" +MakeArrayPrintable(relationshipAdvice.GetTruthTable()[0]));
                 console.log("Amount of Questions asked: "+Choices.length/3);
            }
           
         
           
        }else{
            
            $("#YourList").text("Asking Initial Questions");
            ProgressBar(Math.round(((IndexPos)/labels.length)*50)+4);
        }

        if (!loading) {
            if (!(TestForClass(allBoxes, ("selected-bad")) && TestForClass(allBoxes, ("selected-good"))) && direction) {
            } else {
              
                MoveButtons(labels, direction);
                
            }
        }
        Loading(loading);
        function MakeArrayPrintable(array){
            prettyString = "";

            array.slice(0,array.length-1).forEach((ele)=>{
                prettyString +=  ele+ ", "+" ";
                
            });
            prettyString +=  array[array.length-1];
            console.log(prettyString);
            return prettyString
        }
        
    }

    function UpdateButtons() {
        var tempArray = [Choices[(IndexPos)], Choices[IndexPos + 1], Choices[IndexPos + 2]];

        if (!(TheChoosenOnes[IndexPos / 3] == false) && !(TheChoosenOnes[IndexPos / 3] == undefined)) {

            allBoxes.removeClass("selected-good");
            allBoxes.removeClass("selected-bad");
            Options[tempArray.indexOf(TheChoosenOnes[IndexPos / 3][0])].addClass("selected-good");
            Options[tempArray.indexOf(TheChoosenOnes[IndexPos / 3][2])].addClass("selected-bad");
        } else {
            window.setTimeout(function () {
                allBoxes.removeClass("selected-good");
                allBoxes.removeClass("selected-bad");
            }, 300);

        }
    }

    function InfoBoxToggle(Toggle) {
        if (infodown) {
            d = new Date();
            if ((infodown) && cooldown < d.getTime()) {
                $("#HelpBox").removeClass("infoboxdown");
                $("#YourList").removeClass("opacity0");
                infodown = false;
            }

        } else if (Toggle) {
            $("#HelpBox").addClass("infoboxdown");
            $("#YourList").addClass("opacity0");
            infodown = true;

        }
    }

    function ChoiceModule(init) {
        var boxes;
        var ChoicesBuffer = [];
        var NumBuffer;
        var ItemBuffer;
        var YetAnotherBuffer
        if (PreProccessedOptions.length < 3) { //If not enough Items
            Choices = ["Error", "Error", "Error"];
            return false;



        }
        if (init) { //For The First Time Populates Boxes
            var extrasNeeded = 0;
            var boxes = Math.ceil(((3 / 2) * PreProccessedOptions.length - (3 / 2)) / 3) * 3;




            var extras = [];
            var tempArray = PreProccessedOptions.slice();
            var linkingChoicesMirror;
            var linkingChoices = []; //Choices that are Common Between Two Selection Groups
            var linkingChoiceIndex = (Math.floor(Math.random() * 3));
            var tempNumbers;
            for (var i = 1; i < (boxes / 3); i++) { //Define Linking Choices
                NumBuffer = tempArray.splice(Math.floor(Math.random() * tempArray.length), 1)[0];
                linkingChoices.push(NumBuffer);
                linkingChoices.push(NumBuffer);
            }
           
            //console.log("Linkers: "+linkingChoices);
            linkingChoicesMirror = tempArray.slice();
            for (var i = 0; i < 3; i++) {

                if (i == linkingChoiceIndex) {
                    ChoicesBuffer.push(linkingChoices.splice(Math.floor(Math.random() * (linkingChoices.length)), 1)[0]);

                } else {
                    ChoicesBuffer.push(tempArray.splice(Math.floor(Math.random() * (tempArray.length)), 1)[0]);
                }

            }

            if (boxes > 6) {
                for (var i = 2; i < (boxes / 3); i++) { //Set Middle Choice Groups
                    linkingChoiceIndex = (Math.floor(Math.random() * 2));
                    if (linkingChoiceIndex == 1) {
                        NumBuffer = 2;
                    } else {
                        NumBuffer = (Math.floor(Math.random() * 2)) + 1;
                    }


                    for (var b = 0; b < 3; b++) {

                        if (b == linkingChoiceIndex) {
                            YetAnotherBuffer = linkingChoices.splice(Math.floor(Math.random() * (linkingChoices.length)), 1)[0];
                            ChoicesBuffer.push(YetAnotherBuffer);

                        } else if (b == NumBuffer) {
                            ItemBuffer = Math.floor(Math.random() * (linkingChoices.length));
                            var as = 0;

                            while (linkingChoices.slice(ItemBuffer, ItemBuffer + 1)[0] == YetAnotherBuffer) {
                                as++;

                                ItemBuffer = Math.floor(Math.random() * (linkingChoices.length));
                                if (as > 500) {
                                    console.log("OUCH SOMETHINGS WRONG");
                                    break;

                                }
                            }
                            ChoicesBuffer.push(linkingChoices.splice(ItemBuffer, 1)[0]);
                        } else {
                            ChoicesBuffer.push(tempArray.splice(Math.floor(Math.random() * (tempArray.length)), 1)[0]);
                        }

                    }

                }
            }
            extrasNeeded = 2 - tempArray.length;
            for (var i = 0; i < extrasNeeded; i++) {
                tempNumbers = linkingChoicesMirror.splice(Math.floor(Math.random() * (linkingChoicesMirror.length)), 1)[0]
                while(tempArray.includes(tempNumbers)){ //prevents showing two of the same option in one choice block
                    tempNumbers = linkingChoicesMirror.splice(Math.floor(Math.random() * (linkingChoicesMirror.length)), 1)[0];
                }
                extras.push(tempNumbers);
                

            }

            for (var i = 0; i < 3; i++) {

                if (i == linkingChoiceIndex) {
                    ChoicesBuffer.push(linkingChoices.splice(Math.floor(Math.random() * (linkingChoices.length)), 1)[0]);

                } else if (tempArray.length > 0) {
                    ChoicesBuffer.push(tempArray.splice(Math.floor(Math.random() * (tempArray.length)), 1)[0]);
                } else {
                    ChoicesBuffer.push(extras.splice(Math.floor(Math.random() * (extras.length)), 1)[0]);
                }

            }
            if (logLinkers) {
                console.log(" Left Overs " + tempArray);
                console.log(" Linkers Left Overs " + linkingChoices);
                console.log(extras + "Extras");
                console.log(ChoicesBuffer);
            }
            Choices = ChoicesBuffer.slice();
        }


    }


    function Loading(loading) {
        if (loading) {
            $(".nav-buttons").addClass("loading");
            $(".Choices").addClass("loading");
            window.setTimeout(function () {
                if (loading) {
                    $(".indicator").addClass("stillLoading")


                }
            }, 1800);

        } else {
            $(".nav-buttons").removeClass("loading");
            $(".Choices").removeClass("loading");
            $(".indicator").removeClass("stillLoading")
        }
    }
    function TestForClass(obj, theClass) {

        if (obj.hasClass(theClass)) {
            return true;
        }


    }
    function ProgressBar(per){
        per = per*.89
        $(".meter > span").animate({
            width: per+"%"
          }, 600);
        if(per<40){
            $(".meter").addClass("red");
            $(".meter").removeClass("orange");  
        }else if(per<65){
            $(".meter").addClass("orange");
            $(".meter").removeClass("red");
        }else{
            $(".meter").removeClass("red");
            $(".meter").removeClass("orange");
        }
    }
   
    

}


//var RelationshipAdvices = new RelationshipAdvice();
//RelationshipAdvices.initValues([["2", "5", "4"], ["8", "6", "4"], ["1", "3", "6"],
// ["1", "7", "5"]]);
//console.log(RelationshipAdvices.GetTruthTable());
//console.log(RelationshipAdvices.GetNextQuestions());
//RelationshipAdvices.AddValues([["8", "7", "5"]]);   
//console.log(RelationshipAdvices.GetStatus());
//RelationshipAdvices.AddValues([["6", "2", "1"], ["8", "7", "3"], ["3", "2", "5"],["2","4","7"]]);   
//console.log(RelationshipAdvices.GetStatus());
//console.log(RelationshipAdvices.GetTruthTable());
//console.log(RelationshipAdvices.GetNextQuestions());

function RelationshipAdvice(){
    var arrayEncoder;
    var initialSelections; 
    var finalTruthTable;
    var ambiguousRelationships;
    var addedVals;
    var error = {broke:false, ErrorInfo:""};
    var finalStage;

    var hijackNextQuestion = null;

    var status = "Not Initialized";
   
    this.initValues = function(allSelections){
        console.time('Time Test');

        truthTables = [];
        initialTruthTable = [];
        finalTruthTable = [];
        ambiguousRelationships = [];
        addedVals;
        error = {broke:false, ErrorInfo:""};
        finalStage = new FinalStage();

        arrayEncoder = new ArrayEncoder(allSelections.CreateDetachedCopy());
        initialSelections = arrayEncoder.GetEncodedArray(allSelections).CreateDetachedCopy(); 
    
         setTimeout(function() {
           // console.log(finalTruthTable); 
            // console.log(ambiguousRelationships);
        }, 100);
      
        StageOneErrorResolver(initialSelections);
        
        
        finalTruthTable = initialSelections.CreateDetachedCopy();
        //console.log("finalTruthTable TEST");
        //console.log(finalTruthTable.CreateDetachedCopy());
        try{ //breaks out of hijack array found
            RefineFinalTruth(); 
       

            CreateAndRefineAmbiguousRelationships();
    
            var time = console.timeEnd('Time Test');
        }catch(err){
            console.error(err);
        }
           
    }

    this.AddValues = function(valuesToAdd){ 
        addedVals = arrayEncoder.GetEncodedArray(valuesToAdd);

        StageOneErrorResolver(initialSelections, addedVals[0]);
        initialSelections = initialSelections.concat(addedVals);
       
        
        finalTruthTable = finalTruthTable.concat(addedVals.CreateDetachedCopy());
       
        try{
        RefineFinalTruth(); 
        
        CreateAndRefineAmbiguousRelationships();
        }catch(err){
            console.error(err);
        }
    }

    this.RemoveValues = function(amountToRemove){

        //TODO
    }

    this.GetNextQuestions = function(amount=1){
       
        return arrayEncoder.Decode(finalStage.DetermineAmbiguityResolutionQuestions(ambiguousRelationships,amount,hijackNextQuestion));
       
    }

    this.GetPercentage = function(){
        return finalStage.GetProgressPercentage();
    }

    this.GetCompletionStatus = function(){
        return finalStage.GetCompletionStatus();
    }

    this.GetTruthTable = function(){
        return arrayEncoder.Decode(finalTruthTable);
    }
    this.GetStatus = function(){
        return status;
    }
    


    function RefineFinalTruth() { 
        //Merge Truth tables
        //delete all truths that have been utilized

        var log = false;
        if(log){
            console.logd = console.log;
        }else{
            console.logd = function(a){

            }
        }
       
        var alreadyResolved = [], count = 0;

        do{
            FinalStageErrorResolver(finalTruthTable,initialSelections);

            var DetachedArray = finalTruthTable.CreateDetachedCopy(); 
            var tempArray, numsSearched = [], restart = false;

            for (var i = 0; i < finalTruthTable.length - 1; i++) {
                for (var v = 0; v < finalTruthTable[i].length; v++) {
                    var num = finalTruthTable[i][v];
                        tempArray = finalTruthTable.slice(i + 1, finalTruthTable.length).FindNestledMatches(num);
                        currentSelectionArray = finalTruthTable[i];

                        numsSearched.push(num);

                        for (var c = 0; c < tempArray[0].length; c++) {  //Run for each match found
                            if (tempArray != false) {
                                console.logd("num "+ num);
                                console.logd(currentSelectionArray);
                                console.logd(tempArray[0][c]);
                                if(TestTheseConditions(num, currentSelectionArray, tempArray[0][c], DetachedArray, alreadyResolved)){
                                    restart = true;
                                    break;
                                }
                                
                               
                            }

                        }
                        if(restart){
                            break;
                        }

                    
                }
                if(restart){
                    break;
                }

            }
         if(count > 100){
             console.log("UH OH! IN REFINE INIITIAL TRUTH");
             break;
             restart = false;
         }
         count++;
        
            finalTruthTable = DetachedArray.sort(function(a,b){
                return b.length-a.length;
            });
           

           var redundancyResolver = new ResolveRedundancy;
           redundancyResolver.Refresh(finalTruthTable); //Resolve redundancies
           alreadyResolved = alreadyResolved.concat(redundancyResolver.GetResolvedArrays());
           redundancyResolver.Reset();
          
           alreadyResolved = alreadyResolved.filter((item, index, arr)=>{ // removes duplicates in already resolved array
            var i = 0;   
            for(i = 0; i<arr.length; i++){
                
                    if(ArraysEqual(item,arr[i])){
                      
                       break;
                    }
                }
               
                return i == index;
           });
          
         
         
           console.logd("FinalTruthTable");
           console.logd(finalTruthTable);
            
        }while(restart);
      
       
    }

    function CreateAndRefineAmbiguousRelationships() {
        //Create Ambiguous List
        //Break ambiguous List down into basic form
        //Check if Ambigouity resolves from final truth table
       
        ambiguousRelationships = [];
        CreateAmbiguousRelationships(finalTruthTable,ambiguousRelationships);
      
        var ambiguousList = ambiguousRelationships.CreateDetachedCopy();

        for(var x = 0; x<2; x++){ //breaks all ambiguos relationships into most basic form
        
        var tempList = []; 
        for(var i = 0; i<ambiguousList.length; i++){
            if(ambiguousList[i][0].length>1){
                for(var c = 0; c<ambiguousList[i][0].length; c++){
                    tempList.push([ambiguousList[i][0][c],ambiguousList[i][1]]);
                }
            }else if(ambiguousList[i][1].length>1){
                for(var c = 0; c<ambiguousList[i][1].length; c++){
                    tempList.push([ambiguousList[i][1][c],ambiguousList[i][0]]);
                    
                }
            }
        }
        
       
        ambiguousList = ambiguousRelationships = tempList;
        
        } 
    
    ambiguousRelationships = ambiguousRelationships.filter((item, index, arr) => { //filters self redundancys
        var i;
        if(item[0]==item[1]){
            return false;
        }
        for(i = 0; i<arr.length; i++){
            if((arr[i][0]==item[0]&&arr[i][1]==item[1])||(arr[i][1]==item[0]&&arr[i][0]==item[1])){
                break;
            }
        }
        return (i == index);
    });

    ambiguousRelationships = ambiguousRelationships.filter(item=>{
        var returnMe = true;
         for(i = 0; i<finalTruthTable.length; i++){
            if(finalTruthTable[i].includes(item[0])&&finalTruthTable[i].includes(item[1])){
                returnMe = false;
            }
         }
        return returnMe;
    });
   
    function CreateAmbiguousRelationships(truthTable,ambiguousList){//filters truth table redundancys
        for(var i = 0; i<truthTable.length-1; i++){
            for(var v = i+1; v<truthTable.length; v++){
                ambiguousList.push([truthTable[i],truthTable[v]]);
            }
        }
     }

    }
   
    function FinalStage() { // is in charge of when to end program
        //Find the answers that are included in refined ambigous relations the most and generate a question list
        //Once ambiuity questions are down to zero signal done
        var initialAmbiguityAmount = 0, firstTime = true, currentAmbiguityAmount;

        this.DetermineAmbiguityResolutionQuestions = function(ambigousList,amount=1,hijacked = null){  
            var returnMe = [], tempnum;
            if(hijacked == null){
                status = "Resolving Based on Edge Optimized Algorithms";
            var scores = ScoreAmbiguity(ambigousList,finalTruthTable);
            
            if(scores.length==0){
                status = "Done";
                console.log("Done, but for some reason still trying to get new questions");
                returnMe = [-1,-1,-1];
            }else{

            if(firstTime){  //Allows for progress Percentage to be reached
                initialAmbiguityAmount = ambiguousRelationships.length;
                currentAmbiguityAmount = ambiguousRelationships.length;
                firstTime = false;
            }else{
                currentAmbiguityAmount = ambiguousRelationships.length;
               
            }

            var breakMe = false;
            var tempSortArray = [];
            var tempArrayIndex = 0, Largest = 0;
            var i = 0;
           
            while(!breakMe){ //sort all items based on given score
                
                if(scores.length == 0){ //if done
                    breakMe = true;
                    break;
                }
                
               if(scores[i]>Largest){
                    Largest = scores[i];
                    tempArrayIndex = i;
                }
                i++;
                if(i==scores.length){
                    tempSortArray.push(ambigousList[tempArrayIndex]);
                    ambigousList.splice(tempArrayIndex,1);
                    scores.splice(tempArrayIndex,1);
                    i = 0;
                    Largest = 0;
                    
               }

                
               

            }
           ambigousList = tempSortArray;
           breakMe = false;
            for(i = 0; i<ambigousList.length; i++){
                for(v = i+1; v<ambigousList.length; v++){
                    
                   if(ambigousList[i].includes(ambigousList[v][0])||ambigousList[i].includes(ambigousList[v][1])){
                
                       breakMe=true;
                        break;
                   } 
                }
                if(breakMe){
                    break;
                }
            }
         
            if(breakMe){
                console.logc("ambigousList");
                console.logc(ambigousList[6]);
                console.logc("i, v");
                console.logc("i: "+i+"  v: "+v);
                if(ambigousList[i].includes(ambigousList[v][0])){
                    
                    returnMe = ambigousList[i].concat(ambigousList[v][1]);
                }else{
                    
                    returnMe = ambigousList[i].concat(ambigousList[v][0]);
                }
            }else{
                if(ambigousList.length>1){
                  
                    
                    returnMe = ambigousList[0].concat(ambiguousList[1][0]);
                 
                }else{
                    do{
                        i = finalTruthTable[0][Math.round(Math.random() * (finalTruthTable[0].length-1))];
                    }while(ambigousList[0].includes(i));
                    returnMe = ambigousList[0].concat(i);
                }
            }
            //console.log(ambigousList);
            ambiguousRelationships = ambigousList.CreateDetachedCopy();
            console.log(returnMe);
            }
            }else{ //if hijacked
                returnMe = hijacked;
                hijacked = null;
            }
            return returnMe;

            function ScoreAmbiguity(ambigousList,truthTable){ //values nearness to edges and repitition among truth tables
                var maxLength = 0,x,tempNum,tempScore = 0,tempLength,scoreArray = [],even = false;;
                truthTable.forEach(ele=>{ //figure out max length
                    if(ele.length>maxLength){
                        maxLength = ele.length;
                    }
                });
                
            ambigousList.forEach(ele=>{
                tempScore = 0
                ele.forEach(num=>{
                for(x = 0; x<truthTable.length; x++){
                    tempNum = truthTable[x].indexOf(num);
                    tempLength = truthTable[x].length;
                    if(tempNum!=-1){
                        tempNum++;
                        if((tempNum/tempLength)<.5){ //if found in first half of array
                            tempScore+=(tempLength/maxLength)*(tempLength/tempNum)*10;
                        }else{
                            tempScore+=(tempLength/maxLength)*(tempLength/((tempLength+1)-tempNum))*10;
                        }
                    }
                }
                if(even){
                scoreArray.push(tempScore);
                    even = false;
                }else{
                    even = true;
                }
            });
            });
            return scoreArray;
            }
            
        }

         this.GetProgressPercentage = function(){ //Gets the percentage the program is at
            if(firstTime){
                console.log("Please run DetermineAmbiguityResolutionQuestions First")
            }
             return Math.round(((initialAmbiguityAmount-currentAmbiguityAmount)/initialAmbiguityAmount)*100);
        }
        
        this.GetCompletionStatus = function(){
            if(ambiguousRelationships.length==0&&hijackNextQuestion==null){
                return true;
            }
                return false;

        }

    }
    //var TheeArray = [[1,2,3],[4,6,7],[3,7,1],[1,5,3],[1,7,4],[1,3,2]];
    
   // StageOneErrorResolver(TheeArray);
    //console.log(TheeArray);
    function StageOneErrorResolver(selection, addedArray = false) { //Resolves Errors in Initial User Selection Table

        //only searches the first array added
    
    
        var Counters = 0;
        var log = false; //Logs Events in Function
        if (log) {
            console.logc = console.log;
        } else {
            console.logc = function (nothing) {

            }
        }
        var selections = selection.CreateDetachedCopy();
    
        if (!addedArray) { //Search all
        
        } else { //search only first arrays
            
            selections.push(addedArray);
            console.logc(selections);

        }
        var  selectionTotalLength = selections.length;
        
        var oneRun = false;
        do { //loop to regenerate values if error found
            console.logc("Selections");
            console.logc(selections);
          
            restart = false;
        
                var tempArray;
                
                for (var i = selectionTotalLength - 1; i > 0; i--) {
                    if(!addedArray){

                    }else{

                        if(oneRun){
                            
                            break;
                        }
                        oneRun=true;
                    }
                        
                    
                    for (var v = selections[i].length; v >= 0; v--) {
                    
                        var num = selections[i][v];
                        
                        
                        
                        console.logc(selections[i]);
                        console.logc("i " + i);
                        console.logc("v " + v);

                    
                            tempArray = selections.slice(0, i).FindNestledMatches(num);
                            currentSelectionArray = selections[i];
                            
                            if(tempArray[0].length != 0){
                            console.logc("Array Being Scanned: ");
                            console.logc(tempArray[0]);
                            console.logc("Slice: ")
                            console.logc(selections.slice(0, i));
                            console.logc("Num " + num);
                            }

                            for (var c = 0; c < tempArray[0].length; c++) {  //Run for each match found
                            
                                    var tempError = TestForInternalConflict(num, currentSelectionArray, tempArray[0][c]);

                                    if (tempError[0]!=false) {
                                        console.logc("Selections: ");
                                        console.logc(currentSelectionArray);
                                        console.logc(tempArray[0][c]);
                                        var replacementValue = FlipArrayValues(tempArray[0][c], num, tempError[1][0]);
                                        
                                        console.logc("ErrorFound");
                                        console.logc(selections[i]);
                                        console.logc(tempError[1][0] + "  " + num);
                                        console.logc("replacementValue");
                                        console.logc(replacementValue);
                                        
                                        selection[tempArray[1][c]] = replacementValue;

                                        console.logc("initialSelections Updated");
                                        console.logc(initialSelections);
                                        restart = true;
                                        oneRun = false;
                                        initialTruthTable = [];
                                        ambiguousRelationships = [];
                                        break;
                                    }
                                

                            }
                            if (restart) {
                                selections = selection.CreateDetachedCopy();
                                if (!addedArray) { //Search all
                                
                                } else { //search only first arrays
                                    
                                selections.push(addedArray);
                                    
                                }
                                break;
                            }
                        
                    }
                    if (restart) { //Get out of all for loops and restart
                        break;
                    }
                }
            
                if(Counters>300){
                    console.log("ERROR IN STAGE ONE ERROR RESOLVER OVER FLOW");
                    break;
                }
                Counters++;
            
        } while (restart);
        
    }
  
    
    function FinalStageErrorResolver(selection,resolvingSelection,log = false) { //Resolves Errors in any Selection Table

        //only searches the first array added
        var resolvingSelectionReversed = resolvingSelection.reverse();
        var Counter = 0;
        //var log = false; //Logs Events in Function
        if (log) {
            console.logc = console.log;
        } else {
            console.logc = function (nothing) {

            }
        }
        var MatchingArray, MatchingArrayMain = [], errorWasFound;
        console.logc("selection: ");
        console.logc(selection);
        var unresolvedErrors = [],truthTable = [] ,tempError, tempBool, tempTruthTable = [], unresolvedErrorsMainLoop = [];
            for(var i = 0; i<selection.length-1; i++){ //Iterate through all selection items but the last one
                unresolvedErrors = [];
               
                    MatchingArray = FindCommonalities(selection[i],selection.slice(i+1),i+1,i); //returns [second array index in selections,
                    //[[second array numbers],[second array indexes],[[first array numbers][first array indexes]]]
                  
                    errorWasFound = false;
                    MatchingArray = MatchingArray.filter((ele)=>{
                        tempBool = false;
                        ele[1][0].forEach((ele1)=>{
                            
                            tempError = TestForInternalConflict(ele1,ele[1][0],ele[2][0])
                            if(tempError[0]!=false){
                                tempBool = errorWasFound = true;
                                tempError[1].forEach(eles=>{
                                unresolvedErrors.push([eles,ele1]);
                                });
                            }else{

                            }
                            
                        });
                        return tempBool;
                    }); 

                    unresolvedErrors = unresolvedErrors.filter((item, index, arr) => { //filters self redundancies
                        var i;
                        if(item[0]==item[1]){
                            return false;
                        }
                        for(i = 0; i<arr.length; i++){
                            if((arr[i][0]==item[0]&&arr[i][1]==item[1])||(arr[i][1]==item[0]&&arr[i][0]==item[1])){
                                break;
                            }
                        }
                        return (i == index);
                    });
                 
                   
                    unresolvedErrors = unresolvedErrors.filter(ele=>{ //removes all Errors that are resolved
                        tempBool = true;
                        truthTable.forEach(eles=>{ //Check if redundant to truthtable
                            if(eles.includes(ele[0])&&eles.includes(ele[1])){
                                tempBool = false;
                            }
                        });
                      
                        if(tempBool){
                            console.logc(resolvingSelectionReversed);
                            resolvingSelectionReversed.forEach(ele1=>{ //resolves based on resolving selection array
                               
                                tempError = [ele1.indexOf(ele[0]), ele1.indexOf(ele[1])]; 
                                if(tempError[0]!=-1&&tempError[1]!=-1){
                                    console.logc("Resolved in Selection array");
                                    tempBool = false;
                                    if(tempError[0]>tempError[1]){
                                        truthTable.push([ele[1],ele[0]]);
                                    }else{
                                        truthTable.push([ele[0],ele[1]]);
                                    }
                                }
                            
                            });

                            if(tempBool){ //if not already found
                              
                                tempTruthTable = [];
                            selection.forEach(ele1=>{ //Resolves based on truth table 
                                tempError = [ele1.indexOf(ele[0]), ele1.indexOf(ele[1]),ele1.indexOf(ele[0])- ele1.indexOf(ele[1])]; 
                               
                                if(tempError[0]!=-1&&tempError[1]!=-1){
                                   
                                    if(tempError[2]<=2&&tempError[2]>0){
                                        tempTruthTable.push([ele[1],ele[0],tempError[2]]);
                                        tempBool = false;
                                    }else if(tempError[2]>=-2&&tempError[2]<0){
                                       
                                        tempTruthTable.push([ele[0],ele[1],-tempError[2]]);
                                        tempBool = false;
                                    }
                                }
                            });
                           
                         
                            tempError =  [3,-1,true]; //[Distance,index, if last one was equal] 
                            tempTruthTable.forEach((ele,index)=>{ // Figures out the best match
                                if(tempError[0]>ele[2]){ //if distance is less then prevous smallest
                                    tempError[0] = ele[2];
                                    tempError[1] = index;
                                    tempError[2] = false;
                                }else if(tempError[0]==ele[2]){ // last value is of equal distance
                                 
                                    tempError[2] = true;
                                }
                            });
                            if(!tempError[2]&&tempError[0]!=3){
                                truthTable.push([tempTruthTable[tempError[1]][0],tempTruthTable[tempError[1]][1]]);
                            }else{ //Tie or no existant
                              
                                tempBool=true;
                            }

                            }
                        }
                        console.logc("truthTable");
                        console.logc(truthTable.CreateDetachedCopy());

                        return tempBool;
                    });
                   
                    unresolvedErrorsMainLoop = unresolvedErrorsMainLoop.concat(unresolvedErrors);
                    if(MatchingArray.length!=0&&unresolvedErrors.length==0){
                        MatchingArrayMain.push(MatchingArray);
                    }
                    
        }
        
        if(unresolvedErrorsMainLoop.length!=0){ // IF errors left unresolved
        status = "Resolving Errors";
        
        tempTruthTable = [];
     
            for(var i = 0; i<unresolvedErrorsMainLoop.length-1; i++){
                unresolvedErrorsMainLoop.slice(i+1).forEach(ele=>{
                    if(unresolvedErrorsMainLoop[i].includes(ele[0])){
                        tempTruthTable = [unresolvedErrorsMainLoop[i][0],unresolvedErrorsMainLoop[i][1],ele[1]];
                    }else if(unresolvedErrorsMainLoop[i].includes(ele[1])){
                        tempTruthTable = [unresolvedErrorsMainLoop[i][0],unresolvedErrorsMainLoop[i][1],ele[0]];
                    }
                });
            } 
         
        if(tempTruthTable.length==0){
            do{
                tempTruthTable = finalTruthTable[0][Math.round(Math.random() * (finalTruthTable[0].length-1))];
            }while(unresolvedErrorsMainLoop[0].includes(tempTruthTable));
            tempTruthTable = unresolvedErrorsMainLoop[0].concat(tempTruthTable);
        }
           
            console.log("Hijack Array");
             console.log(tempTruthTable);
            hijackNextQuestion = tempTruthTable.CreateDetachedCopy();
            throw new Error("Hijack Array Needed");
        }else if(MatchingArrayMain.length!=0){ //if all Still need to make edit based on truth table
            MatchingArrayMain.forEach(ele=>{
                ele.forEach(ele=>{
                   // console.log("ele[1]");
                   // console.log(ele[1]);
                   
                        ele[1][0].sort((a,b)=>{
                            for(var i = 0; i<truthTable.length; i++){
                               
                                if(truthTable[i].indexOf(a)-truthTable.indexOf(b)>0){
                                   
                                    return 1;
                                }else if(truthTable[i].indexOf(a)-truthTable.indexOf(b)<0){
                                   
                                    return -1;
                                }
                            }
                           
                        });
                        console.logc("truthTable.CreateDetachedCopy()");
                        console.logc(truthTable.CreateDetachedCopy());
                      //  console.log(ele[1].CreateDetachedCopy());
                        ele[2][0].sort((a,b)=>{
                            for(var i = 0; i<truthTable.length; i++){
                               
                                if(truthTable[i].indexOf(a)-truthTable.indexOf(b)>0){
                                   
                                    return -1;
                                }else if(truthTable[i].indexOf(a)-truthTable.indexOf(b)<0){
                                   
                                    return 1;
                                }
                            }
                        });
                        console.logc("selection.CreateDetachedCopy()");
                        console.logc(selection.CreateDetachedCopy());
                        console.logc("ele");
                        console.logc(ele.CreateDetachedCopy());
                        ele[1][1].forEach((eles1,index)=>{ //actually changes selection array
                            selection[ele[0][0]][eles1] = ele[1][0][index];
                        });
                        ele[2][1].forEach((eles1,index)=>{ //actually changes selection array
                            selection[ele[0][1]][eles1] = ele[2][0][index];
                        });
                        console.logc(selection.CreateDetachedCopy());
                        
                });
            });
            console.logc("MatchingArrayMain");
            console.logc(MatchingArrayMain);
        }
        
        
        
      

      


    }
   
    function FindCommonalities(array,wholeList,Offset,index1){ //returns common numbers between two arrays and their respective indexes
        var returnMe=[], tempArray=[],tempArray2=[],tempNum, eleTempArray=[], tempNumTempArray=[], indexTempArray=[];
        wholeList.forEach((mainEle,mainIndex)=>{
            tempArray=[];
            tempArray2=[];
            eleTempArray=[], tempNumTempArray=[], indexTempArray=[];

              array.forEach((ele,index)=>{
                tempNum = mainEle.indexOf(ele);
                if(tempNum!=-1){
                    eleTempArray.push(ele);
                    tempNumTempArray.push(tempNum);
                    indexTempArray.push(index);
                }
        });
       
       
       
        var j,a,n = eleTempArray.length;
        if(n!=0){
           
          
            tempArray = [eleTempArray.CreateDetachedCopy(),tempNumTempArray];
            tempArray2= [eleTempArray,indexTempArray];
            for (var i = 0; i < n; ++i)  //order array
            {
                for (j = i + 1; j < n; ++j)
                {
                    if (tempArray[1][i] > tempArray[1][j]) 
                    {
                        a =  tempArray[1][i];
                        tempArray[1][i] = tempArray[1][j];
                        tempArray[1][j] = a;

                        a =  tempArray[0][i];
                        tempArray[0][i] = tempArray[0][j];
                        tempArray[0][j] = a;
                    }
                }
            }

        returnMe.push([[mainIndex+Offset,index1],tempArray,tempArray2]);
        }
    });

        return returnMe;
    }

    function ResolveRedundancy(){
        if (false) {
            console.logh = console.log;
        } else {
            console.logh = function (nothing) {

            }
        }
        var resolvedArrays = [];
        var i = 0;
    this.Refresh =  function(truthTable, truthTable1){
        while(this.ResolveRedundancy(truthTable,truthTable1)){ //Runs until all reduncies resolved
                
            if(i>500){ //if stuck in infinate loop
                console.log("BIG ERROR: " + i);
                broke = true;
                errorName = "Initial Truth Array Refinement Failed";
                break; 
                
            }
            i++;
        }
    }
    this.ResolveRedundancy =  function(truthTableProtected, truthTable1 = false){

        var breakOut = false;
        var scanTruthTempArray;
        var truthTempArray, scanTruthTable, matchesInRow, matchingIndexesArray, v, i, Current, element,tempIndex,iOffset, returned;
    
        var truthTable = truthTableProtected.CreateDetachedCopy();
        var endOffset = 1;
       if(truthTable1!=false){
            truthTable= truthTable1.concat(truthTableProtected);
            endOffset = truthTable1.length;
       }
        for(i = truthTable.length-1; i>endOffset-1; i--){
             scanTruthTable = truthTable.slice(0,i);
           
          
           
             matchingIndexesArray = [];
           
            for(v = 0; v < scanTruthTable.length; v++){
                matchesInRow = 0;
                scanTruthTempArray = scanTruthTable[v];
                truthTempArray = truthTable[i];

                for(Current = 0; Current < truthTempArray.length; Current++){

                     element = truthTempArray[Current];
                    
                    tempIndex = scanTruthTempArray.indexOf(element);
                    if(tempIndex!=-1){
                        console.logh("Update ME "+ truthTempArray);
                        console.logh("Keep ME "+ scanTruthTempArray);
                
                        matchesInRow++;
                        console.logh(matchesInRow);
                        matchingIndexesArray.push(Current);
                    }else {
                        matchesInRow=0;
                        matchingIndexesArray=[];
                    }

                    if(truthTable1!=false){
                     iOffset = i-(endOffset);
                    }else{
                         iOffset = i;
                    }
                        if(matchesInRow>=truthTempArray.length){
                            console.logh(truthTableProtected.CreateDetachedCopy());
                            resolvedArrays.push(truthTableProtected.splice(iOffset,1)[0]);
                            console.logh("Resoltion");
                            console.logh(resolvedArrays.CreateDetachedCopy());
                            breakOut=true;
                            break;
                        }                

            };
            console.logh(truthTableProtected);
            if(breakOut){ //if Redundancy Detected and Resolved
               
                break;
            }
        }
            if(breakOut){
                break;
            }
        }

        return breakOut;
    }
    this.GetResolvedArrays = function(){
        return resolvedArrays.CreateDetachedCopy();
    }
    this.Reset = function(){
        resolvedArrays = [];
    }

    }
    
    
   
    function ArraysEqual(array1,array2, all = true){ //returns true if all are true in arrays, if all is a false then if the second one can be contained in the first
            var index, lastIndex,consecutives = 0,i=0, returnme=-1;  
        if(all&&array2.length!=array1.length)
            return false;

        for(var z = 0; z<array1.length; z++){
            
            index = array2.indexOf(array1[z]);
          
            
            if(index!=-1){
                if(index==lastIndex+1){
                    consecutives++;
                }else{
                    consecutives = 0;
                }
               
                if(all&&i==0&&index!=0){
                   
                    returnme = false;
                    break;
                }
                if(!all&&consecutives==array2.length-1){
                    returnme = true;
                    break;
                }

            }else if(all){
              
                returnme = false;
                break;
                          
            }else{
                
                consecutives = 0;
            }
            lastIndex = index;
            i++;
        }
        if(returnme!=-1){
             return returnme;
        }
        if(all){
            return true;
        }
        return false;

    }

    function TestForInternalConflict(num, searchArray, matchArray) { //Tests to see if there is any values that are on opposite sides of an ancher in two arrays
        var errorFound = false;
        var searchArrayExterior = ExteriorValues(searchArray, num);
        var matchArrayExterior = ExteriorValues(matchArray, num);
        var erroredElements = [];
       
        if(matchArrayExterior[1]!=-1&&searchArrayExterior[0]!=-1){
        searchArrayExterior[0].forEach(element => {
            if (matchArrayExterior[1].includes(element)) {
                errorFound = true;
                erroredElements.push(element);
            }
        });
    }
    if(matchArrayExterior[0]!=-1&&searchArrayExterior[1]!=-1){
        searchArrayExterior[1].forEach(element => {

            if (matchArrayExterior[0].includes(element)) {
                errorFound = true;
                erroredElements.push(element);
            }
        });
    }

        return [errorFound, erroredElements];

    }

    function TestTheseConditions(num, searchArrayProtected, matchArrayProtected,truthTable, previouslyResolved  = []) { //Adds Values to ambiguousRelationships and TruthTable from final search
        var searchArray = searchArrayProtected.slice();
        var matchArray = matchArrayProtected.slice();
        var searchArrayExteriors =  ExteriorValues(searchArray,num);
        var matchArrayExteriors = ExteriorValues(matchArray,num);
        var tempMatchArray = matchArray.slice();
        var itemCorrected = false;
        var tempArray = [], tempMatchingArray;
        var PinchCondition = CheckForPinchCondition(tempMatchArray, searchArray)[0];
        if(false){ //log or naw
            console.logt = console.log;
        }else{
            console.logt = function(nothing){

            }
        }
        if (PinchCondition != false) { //Check for Pinch Conditions
            console.logt("Pinch");
            truthTable.push(PinchCondition);

        } 
        if(searchArrayExteriors[1]!=-1&&matchArrayExteriors[0]!=-1){
            
            tempArray = matchArrayExteriors[0].slice();
            tempArray.push(num);
            tempMatchingArray = tempArray.concat(searchArrayExteriors[1]);
           
            if(!ArrayContained(previouslyResolved,tempMatchingArray)){
            truthTable.push(tempMatchingArray);
            itemCorrected = true;
            }

        }else if(searchArrayExteriors[0]!=-1&&matchArrayExteriors[1]!=-1){
            tempArray = searchArrayExteriors[0].slice();
            tempArray.push(num);
            tempMatchingArray = tempArray.concat(matchArrayExteriors[1])
            
            if(!ArrayContained(previouslyResolved,tempMatchingArray)){
            truthTable.push(tempMatchingArray);
            itemCorrected = true;
            }

        }
        
        return itemCorrected;
    }

    function ArrayContained(array1,array2,all = true){ //returns true if found complete match in array one
       var returnMe = false; 
       
        for(var i = 0; i<array1.length; i++){
            if(ArraysEqual(array1[i],array2,all)){
                returnMe = true;
                break;
            }
        }
        return returnMe;
    }   

    function FlipArrayValues(array, num1, num2) { //Flips the location of the values num1 and num2 in the array
        var array1 = array.slice();
        var index1 = array1.indexOf(num1);
        
        array1[array1.indexOf(num2)] = num1;
        array1[index1] = num2;
       
        return array1;
    }

    function ExteriorValues(array, num) { // returns values on either side of value in array(doesn't include value)
        var returnNum = [[], []];
        var index = array.indexOf(num);
        if (index > 0) {
            returnNum[0] = array.slice(0, index);
        }else{
            returnNum[0] = -1;
        }
        if (index < array.length - 1) {
            returnNum[1] = array.slice(index + 1);
        }else{
            returnNum[1] = -1;
        }
        return returnNum;
    }

    function CheckForPinchCondition(array1, array2) {
        var arrayOfMatchingIndexes = [];
        var returnArray = false;
        var returnArrayNumber = false;

        array1.forEach(element => {
            var indexOf = array2.indexOf(element);

            if (indexOf != -1) {
                arrayOfMatchingIndexes.push(indexOf);
            }

        });
        arrayOfMatchingIndexes.sort((a, b) => a - b);
        if (arrayOfMatchingIndexes.length > 1) {
            var prevElement;
            //console.log("Array of Mathcing ");
            //console.log(arrayOfMatchingIndexes);
            arrayOfMatchingIndexes.forEach(element => {
                // console.log(element-prevElement);
                if (Math.abs(element - prevElement) == 1) {
                    var endElement = array1.indexOf(array2[element]);
                    var startElement = array1.indexOf(array2[prevElement]);
                    //console.log("Array1 "+(endElement-startElement));
                    if (Math.abs(endElement - startElement) == 2) {
                        //console.log("Slice 1 "+ array2.slice(0,prevElement+1));
                        //console.log("Slice 2 " +array1[startElement+1]);
                        returnArray = array2.slice(0, prevElement + 1).concat(array1[startElement + 1], array2.slice(element));
                        returnArrayNumber = 1;
                    }
                } else if (Math.abs(element - prevElement) == 2) {

                    var endElement = array1.indexOf(array2[element]);
                    var startElement = array1.indexOf(array2[prevElement]);
                    // console.log("Array1 "+(endElement-startElement));
                    if (Math.abs(endElement - startElement) == 1) {
                        //   console.log("Slice 1 "+ array1.slice(0,startElement+1));
                        // console.log("Slice 2 " +array2[prevElement+1]);
                        returnArray = array1.slice(0, startElement + 1).concat(array2[prevElement + 1], array1.slice(endElement));

                        returnArrayNumber = 0;
                    }
                }
                prevElement = element;
            });
        }
        return [returnArray, returnArrayNumber]
    }

    function ArrayEncoder(array){ //Encodes Array into numerics amd decodes back into original format
        var valueMapDecoded = [];
        var valueMapEncoded = [];
        var currentMapValue = 0;
        var tempIndex;

       ArrayRecursionCreateEncodingMap(array);

        this.Decode = function(array1){
            return ArrayRecursionDecode(array1);
        }
    
        this.GetEncodedArray = function(array1 = false){
          
                return ArrayRecursionEncode(array1);
           
        }
    
        function ArrayRecursionCreateEncodingMap(array){  
            var returnMe = [];
            array.forEach(function(el){
                if(typeof el == 'object'){
                    returnMe.push(ArrayRecursionCreateEncodingMap(el));
                }else{
                    returnMe = array.map(ele=>{
                        tempIndex = valueMapDecoded.indexOf(ele);
                        if(tempIndex==-1){
                            valueMapEncoded.push(currentMapValue);
                            valueMapDecoded.push(ele);
                            currentMapValue++;
                            return currentMapValue-1;
                        }else{
                            return valueMapEncoded[tempIndex];
                        }
                    });
                   
                }
            });
            
            return returnMe;
        }

        
        function ArrayRecursionEncode(array){ 
            var returnMe = [];
            array.forEach(function(el){
                if(typeof el == 'object'){
                    returnMe.push(ArrayRecursionEncode(el));
                }else{
                    returnMe = array.map(ele=>{
                        tempIndex = valueMapDecoded.indexOf(ele);
                        if(tempIndex==-1){
                            return -1;
                        }else{
                            return valueMapEncoded[tempIndex];
                        }
                    });
                   
                }
            });
            
            return returnMe;
        }

        
        function ArrayRecursionDecode(array){  
            var returnMe = [];
            array.forEach(function(el){
                if(typeof el == 'object'){
                    returnMe.push(ArrayRecursionDecode(el));
                }else{
                    returnMe = array.map(ele=>{
                        tempIndex = valueMapEncoded.indexOf(ele);
                        if(tempIndex==-1){
                            return -1;
                        }else{
                            return valueMapDecoded[tempIndex];
                        }
                    });
                   
                }
            });
            
            return returnMe;
        }
    
        
    
    }

}



