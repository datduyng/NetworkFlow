//NOTE: here down is a super global 
// variable. allow drag and hold
var down = false;
var hold = false;
//set up jquery business hanlder
$(document).on('mousedown', function(){
    // down = true;
});

$(document).on('mouseup', function(){
    down = false;
    hold = false;
});


var spritePath = {
    'grass' : 'images/sim-asset/grass.png', 
    'ground' : 'images/sim-asset/ground.png', 
    'road-horizontal' : 'images/sim-asset/road-horizontal.png', 
    'road-verticle' : 'images/sim-asset/road-verticle.png', 
    'stop-sign' : 'images/sim-asset/stop-sign.png', 
    'traffic-light' : 'images/sim-asset/traffic-light.png', 
    'construction-man' : 'images/sim-asset/construction-man.png', 
    'construction-barrier' : 'images/sim-asset/construction-barrier.png', 
    'car' : 'images/sim-asset/car.png'
};


function dict2Arr(dict){
    var arr =[];
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            arr.push(dict[key]);
        }
    }

    return arr;

}

var currentTileType = 'grass';

var WIDTH =800;
var HEIGHT = 600;

var tileSize = 50;