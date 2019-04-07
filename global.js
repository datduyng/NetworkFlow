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
    'traffic-light-ns' : 'images/sim-asset/traffic-light-ns.png',
    'traffic-light-we' : 'images/sim-asset/traffic-light-we.png',
    'construction-man' : 'images/sim-asset/construction-man.png', 
    'construction-barrier' : 'images/sim-asset/construction-barrier.png', 
    'car' : 'images/sim-asset/car.png',
    'water' : 'images/sim-asset/water.png',
    'boat' : 'images/sim-asset/boat.png'
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

var carIdAssigner = 0; 
var componentIdAssigner = 0;



function setCarIdAssigner(step){
    carIdAssigner += step;
}

function getNewCarIdAssigner(){
    var step = 2;
    setCarIdAssigner(carIdAssigner+step);
    return carIdAssigner;
}

