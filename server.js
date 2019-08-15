
var http = require("http"); //need to http
let fs = require("fs"); //need to read static files
var url = require("url"); //to parse url strings

var counter = 1000; //to count invocations of function(req,res)
var ROOT_DIR = "html"; //dir to serve static files from
let array2;

let readFile = function(name){
  fs.readFile(name,function(err,data){
 data.toString();
  })
}
let cs = []
let d ='';
let h = 50;
let v = 50;
//let flag = 0;


let convertSong = function(converted){
   cs = [];
   d = '';
   h = 50;
   v = 50;


   data = fs.readFileSync(converted, "utf-8");
       read = data.toString().split("\n");
       d = read;
    for(let i=0; i<read.length; i++) {
      array2 = read[i].split(" ");
      for(let j = 0; j < array2.length; j++){
        if(array2[j].substring(0,1) === "["){
          cs.push({word:array2[j], x:h, y:v, chord:1});
        }
        else{
          cs.push({word:array2[j], x:h, y:v, chord:0});
        }
        h += 10+array2[j].length*15;
        //console.log(cs[j].word);
      }
      h = 50;
      v += 30;

    }
    //flag = 1;
    //console.log(d);
    let r = {word: d,
            wordArray: cs};
      return r;


}




















var MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript", //should really be application/javascript
  json: "application/json",
  png: "image/png",
  txt: "text/plain"
};

var get_mime = function(filename) {
  var ext, type;
  for (ext in MIME_TYPES) {
    type = MIME_TYPES[ext];
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return type;
    }
  }
  return MIME_TYPES["txt"];
};

http
  .createServer(function(request, response) {
    var urlObj = url.parse(request.url, true, false);
    console.log("\n============================");
    console.log("PATHNAME: " + urlObj.pathname);
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
    console.log("METHOD: " + request.method);

    var receivedData = "";

    //attached event handlers to collect the message data
    request.on("data", function(chunk) {
      receivedData += chunk;
    });

    //event handler for the end of the message
    request.on("end", function() {
      console.log("received data: ", receivedData);
      console.log("type: ", typeof receivedData);

      //if it is a POST request then echo back the data.
      if (request.method == "POST") {
        var dataObj = JSON.parse(receivedData);
        console.log("received data object: ", dataObj);
        console.log("type: ", typeof dataObj);
        //Here we can decide how to process the data object and what
        //object to send back to client.
        //FOR NOW EITHER JUST PASS BACK AN OBJECT
        //WITH "text" PROPERTY

        //TO DO: return the words array that the client requested
        //if it exists

        console.log("USER REQUEST: " + dataObj.text);
        let returnObj = {};
        let songName = [];

        let re = convertSong("songs/" + dataObj.text + '.txt');
        //let re = readAgain();
        //setTimeout(function(){
          returnObj.wordArray = re.wordArray;
          returnObj.text = d;

          console.log(d);
          response.writeHead(200, { "Content-Type": MIME_TYPES["txt"] });
          response.end(JSON.stringify(returnObj));
        //},1000);


/*if(dataObj.text === "Peaceful Easy Feeling"){
          returnObj.wordArray =convertSong('songs/Peaceful Easy Feeling.txt');
          returnObj.text = fileRead('songs/Peaceful Easy Feeling.txt');
        }
        else if(dataObj.text === "Sister Golden Hair"){
            returnObj.wordArray = convertSong('songs/Sister Golden Hair.txt');
            returnObj.text = fileRead('songs/Sister Golden Hair.txt');
        }
        else if(dataObj.text === "Brown Eyed Girl"){

            returnObj.wordArray = convertSong('songs/Brown Eyed Girl.txt');

            returnObj.text = fileRead('songs/Brown Eyed Girl.txt');

        }
        else{
        returnObj.text = "NOT FOUND: " + dataObj.text;
      */


        //object to return to client
         //send just the JSON object
      }

      if (request.method == "GET") {
        //handle GET requests as static file requests
        var filePath = ROOT_DIR + urlObj.pathname;
        if (urlObj.pathname === "/") filePath = ROOT_DIR + "/index.html";

        fs.readFile(filePath, function(err, data) {
          if (err) {
            //report error to console
            console.log("ERROR: " + JSON.stringify(err));
            //respond with not found 404 to client
            response.writeHead(404);
            response.end(JSON.stringify(err));
            return;
          }
          response.writeHead(200, { "Content-Type": get_mime(filePath) });
          response.end(data);
        });
      }
    });
  })
  .listen(3000);
console.log("Server Running at PORT 3000  CNTL-C to quit")
console.log("To Test:")
console.log("http://localhost:3000/assignment1.html")

