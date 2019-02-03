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
    "images/sim-asset/grass.png",
    "images/sim-asset/ground.png",
    "images/sim-asset/road-horizontal.png",
    "images/sim-asset/road-verticle.png",
    "images/sim-asset/intersection.png",
    "images/sim-asset/construction-man.png",
    "images/sim-asset/construction-barrier.png"
];

var currentTileType = 'grass';