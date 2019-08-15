
var words = [];
words.push({word: " ", x:50, y:50});
//words.push({word: "enter", x:150, y:50});
//words.push({word: "a", x:220, y:50});
//words.push({word: "song", x:240, y:50});
//words.push({word: "name", x:300, y:50});
let printOut = '';
let array3 = [];
var movingString = {word: "",
                    x: 100,
					y:100,
					xDirection: 1, //+1 for leftwards, -1 for rightwards
					yDirection: 1, //+1 for downwards, -1 for upwards
					stringWidth: 50, //will be updated when drawn
					stringHeight: 24}; //assumed height based on drawing point size

//indended for keyboard control
var movingBox = {x: 50,
                 y: 50,
				 width: 0,
				 height: 0};

var wayPoints = []; //locations where the moving box has been

var timer;


var wordBeingMoved;

var deltaX, deltaY; //location where mouse is pressed
var canvas = document.getElementById('canvas1'); //our drawing canvas




function getWordAtLocation(aCanvasX, aCanvasY){

	  //locate the word near aCanvasX,aCanvasY
	  //Just use crude region for now.
	  //should be improved to using lenght of word etc.

	  //note you will have to click near the start of the word
	  //as it is implemented now
	  for(var i=0; i<words.length; i++){
		 if(Math.abs(words[i].x - aCanvasX) < 20 + words[i].word.length*12 &&
		    Math.abs(words[i].y - aCanvasY) < 20) return words[i];
	  }
	  return null;
    }

var drawCanvas = function(){

    var context = canvas.getContext('2d');

    context.fillStyle = 'white';
    context.fillRect(0,0,canvas.width,canvas.height); //erase canvas

    context.font = '20pt Arial';
    //context.fillStyle = 'cornflowerblue';
    //context.fillStyle = 'GreenYellow';
    //context.strokeStyle = 'blue';

    for(var i=0; i<words.length; i++){  //note i declared as var

			var data = words[i];
			if(data.chord == 1){
			  context.fillStyle = 'GreenYellow';
			  context.strokeStyle = 'Green';
			}
			else{
			  context.fillStyle = 'cornflowerblue';
			  context.strokeStyle = 'blue';
			}
			context.fillText(data.word, data.x, data.y);
            context.strokeText(data.word, data.x, data.y);

	}

    movingString.stringWidth = context.measureText(	movingString.word).width;
	//console.log(movingString.stringWidth);
    context.fillText(movingString.word, movingString.x, movingString.y);

    //draw moving box
	context.fillRect(movingBox.x,
	                 movingBox.y,
					 movingBox.width,
					 movingBox.height);

	//draw moving box way points
	for(i in wayPoints){
		context.strokeRect(wayPoints[i].x,
		             wayPoints[i].y,
					 movingBox.width,
					 movingBox.height);
	}
	//draw circle
    /*context.beginPath();
    context.arc(canvas.width/2, //x co-ord
            canvas.height/2, //y co-ord
			canvas.height/2 - 5, //radius
			0, //start angle
			2*Math.PI //end angle
    );*/
    context.stroke();
}

function handleMouseDown(e){

	//get mouse location relative to canvas top left
	var rect = canvas.getBoundingClientRect();
    //var canvasX = e.clientX - rect.left;
    //var canvasY = e.clientY - rect.top;
    var canvasX = e.pageX - rect.left; //use jQuery event object pageX and pageY
    var canvasY = e.pageY - rect.top;
	console.log("mouse down:" + canvasX + ", " + canvasY);

	wordBeingMoved = getWordAtLocation(canvasX, canvasY);
	//console.log(wordBeingMoved.word);
	if(wordBeingMoved != null ){
	   deltaX = wordBeingMoved.x - canvasX;
	   deltaY = wordBeingMoved.y - canvasY;
	   //document.addEventListener("mousemove", handleMouseMove, true);
       //document.addEventListener("mouseup", handleMouseUp, true);
	$("#canvas1").mousemove(handleMouseMove);
	$("#canvas1").mouseup(handleMouseUp);

	}

    // Stop propagation of the event and stop any default
    //  browser action

    e.stopPropagation();
    e.preventDefault();

	drawCanvas();
	}

function handleMouseMove(e){

	console.log("mouse move");

	//get mouse location relative to canvas top left
	var rect = canvas.getBoundingClientRect();
    var canvasX = e.pageX - rect.left;
    var canvasY = e.pageY - rect.top;

	wordBeingMoved.x = canvasX + deltaX;
	wordBeingMoved.y = canvasY + deltaY;

	e.stopPropagation();

	drawCanvas();
	}

function handleMouseUp(e){
	console.log("mouse up");

	e.stopPropagation();

    //$("#canvas1").off(); //remove all event handlers from canvas
    //$("#canvas1").mousedown(handleMouseDown); //add mouse down handler

	//remove mouse move and mouse up handlers but leave mouse down handler
    $("#canvas1").off("mousemove", handleMouseMove); //remove mouse move handler
    $("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler

	drawCanvas(); //redraw the canvas
	}

//JQuery Ready function -called when HTML has been parsed and DOM
//created
//can also be just $(function(){...});
//much JQuery code will go in here because the DOM will have been loaded by the time
//this runs

function handleTimer(){
	movingString.x = (movingString.x + 5*movingString.xDirection);
	movingString.y = (movingString.y + 5*movingString.yDirection);

	//keep inbounds of canvas
	if(movingString.x + movingString.stringWidth > canvas.width) movingString.xDirection = -1;
	if(movingString.x < 0) movingString.xDirection = 1;
	if(movingString.y > canvas.height) movingString.yDirection = -1;
	if(movingString.y - movingString.stringHeight < 0) movingString.yDirection = 1;

	drawCanvas()
}

    //KEY CODES
	//should clean up these hard coded key codes
	var ENTER = 13;
	var RIGHT_ARROW = 39;
	var LEFT_ARROW = 37;
	var UP_ARROW = 38;
	var DOWN_ARROW = 40;


function handleKeyDown(e){

	console.log("keydown code = " + e.which );

	var dXY = 5; //amount to move in both X and Y direction
	if(e.which == UP_ARROW && movingBox.y >= dXY)
	   movingBox.y -= dXY;  //up arrow
	if(e.which == RIGHT_ARROW && movingBox.x + movingBox.width + dXY <= canvas.width)
	   movingBox.x += dXY;  //right arrow
	if(e.which == LEFT_ARROW && movingBox.x >= dXY)
	   movingBox.x -= dXY;  //left arrow
	if(e.which == DOWN_ARROW && movingBox.y + movingBox.height + dXY <= canvas.height)
	   movingBox.y += dXY;  //down arrow

    var keyCode = e.which;
    if(keyCode == UP_ARROW | keyCode == DOWN_ARROW){
       //prevent browser from using these with text input drop downs
       e.stopPropagation();
       e.preventDefault();
	}

}

function handleKeyUp(e){
	console.log("key UP: " + e.which);
	if(e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW){
	var dataObj = {x: movingBox.x, y: movingBox.y};
	//create a JSON string representation of the data object
	var jsonString = JSON.stringify(dataObj);


	$.post("positionData", jsonString, function(data, status){
			console.log("data: " + data);
			console.log("typeof: " + typeof data);
			var wayPoint = JSON.parse(data);
			wayPoints.push(wayPoint);
			for(i in wayPoints) console.log(wayPoints[i]);
			});
	}

	if(e.which == ENTER){
	   handleSubmitButton(); //treat ENTER key like you would a submit
	   $('#userTextField').val(''); //clear the user text field
	}

	e.stopPropagation();
    e.preventDefault();


}
let t = '1';

function handleSubmitButton () {

    var userText = $('#userTextField').val(); //get text from user text input field
	if(userText && userText != ''){

     //user text was not empty
	   var userRequestObj = {text: userText}; //make object to send to server
       var userRequestJSON = JSON.stringify(userRequestObj); //make json string
	   $('#userTextField').val(''); //clear the user text field

	   //Prepare a POST message for the server and a call back function
	   //to catch the server repsonse.
       //alert ("You typed: " + userText);
	   $.post("userText", userRequestJSON, function(data, status){
			console.log("data: " + data);
			console.log("typeof: " + typeof data);
			var responseObj = JSON.parse(data);



         console.log(responseObj.text);
         //console.log(t);
			//replace word array with new words if there are any

      if(responseObj.wordArray){
        words = responseObj.wordArray;
      }
      if(responseObj.print){
       //printOut = responseObj.print;
     }
     let textDiv = document.getElementById("text-area");
     for(let i = 0;i < responseObj.text.length;i++){
       t = responseObj.text[i];
     textDiv.innerHTML = textDiv.innerHTML + `<p> ${t}</p>`;
   }
			});

}







}


let chord1 = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"]
let chord2 = ["A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab"]


function TransferUp(){

  //console.log("hello world");
  for(let i  = 0 ; i < words.length; i++){
  let c;
  let c1 = 0;
     if(words[i].chord == 1){// substr(start,lenth)
        c = words[i].word.substr(1,1);//after [ and go one unit
        //console.log(c);
        if(words[i].word.substr(2,1) === "b" || words[i].word.substr(2,1) === "#"){
          c+= words[i].word.substr(2,1);
          c1 = 1;
        }
        //console.log(c);

     for(let j = 0; j < chord1.length; j++){
        if(c === chord1[j] && j != chord1.length-1){
           console.log(j);
           console.log(chord1[j])
           c = chord1[j+1];
           j = 13;
        }
        else if(c === chord2[j] && j != chord2.length-1){
           c = chord2[j+1];
           j = 13;
        }
     }
     //console.log(c)
     words[i].word = "[" + c + words[i].word.substr(2+c1,words[i].word.length-1-c1)
     //console.log(c);
     }
  }
  //console.log("hello world");
  drawCanvas();
}



function TransferDown(){

  //console.log("hello world");
  for(let i  = 0 ; i < words.length; i++){
  let c;
  let c1 = 0;
     if(words[i].chord == 1){
        c = words[i].word.substr(1,1);
        //console.log(c);
        if(words[i].word.substr(2,1) === "b" || words[i].word.substr(2,1) === "#"){
          c+= words[i].word.substr(2,1);
          c1 = 1;
        }
        //console.log(c);

     for(let j = 0; j < chord1.length; j++){
        if(c === chord1[j] && j != 0){
           console.log(j);
           console.log(chord1[j])
           c = chord1[j-1];
           j = 13;
        }
        else if(c === chord2[j] && j !=0){
           c = chord2[j-1];
           j = 13;
        }
     }
     //console.log(c)
     words[i].word = "[" + c + words[i].word.substr(2+c1,words[i].word.length-1-c1)
     //console.log(c);
     }
  }
  //console.log("hello world");
  drawCanvas();
}










$(document).ready(function(){
	//This is called after the broswer has loaded the web page

	//add mouse down listener to our canvas object
	$("#canvas1").mousedown(handleMouseDown);

	//add key handler for the document as a whole, not separate elements.
	$(document).keydown(handleKeyDown);
	$(document).keyup(handleKeyUp);

	timer = setInterval(handleTimer, 100);
    //timer.clearInterval(); //to stop

	drawCanvas();
});
