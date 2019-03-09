//NOTE: here down is a super global 
// variable. allow drag and hold
var down = false;
var hold = false;
//set up jquery business hanlder
$(document).on('mousedown', function(){
    // down = true;
    console.log("docuemtn down");
});

$(document).on('mouseup', function(){
    down = false;
    hold = false;
    console.log("docuemnt mouseup");
});


var spritePath = [
    "images/sim-asset/grass.png",//0
    "images/sim-asset/ground.png",//1
    "images/sim-asset/road-horizontal.png",//2
    "images/sim-asset/road-verticle.png",//3
    "images/sim-asset/intersection.png",//4
    "images/sim-asset/construction-man.png",//5
    "images/sim-asset/construction-barrier.png",//6
    "images/sim-asset/car.png"//7
];

var currentTileType = 'grass';

var WIDTH =800;
var HEIGHT = 600;

var tileSize = 50;