document.getElementById("uploadcsv").addEventListener("change", loadCSV, true);
document.getElementById("uploadjson").addEventListener("change", loadJSON, true);
//pixijs ex:http://scottmcdonnell.github.io/pixi-examples/index.html?s=demos&f=texture-swap.js&title=Texture%20Swap



var stage = new PIXI.Stage(0x66FF99);
var renderer = new PIXI.autoDetectRenderer(
    WIDTH,
    HEIGHT,
    {view:document.getElementById("game-canvas")}
);


var simulatorMap;
var carList = [];
var trafficComponents = {};

let sprites = {}; 

PIXI.loader.add(dict2Arr(spritePath)).load(setup);

let sheet;

function setup(){
    //example load sprite ssheet
    ///SAVE
    // sheet = PIXI.loader.resources['basic/atlas01.json'].spritesheet;
    // sprites.grass = new PIXI.Sprite(sheet.textures['grass.png']);
    //// sprites.grass = new PIXI.Sprite.fromImage("./basic/grass.png");
    //SAVE
    simulatorMap = new SimulatorMap(stage, renderer, WIDTH/tileSize, HEIGHT/tileSize, tileSize);
    simulatorMap.setupMap();
    renderer.render(stage);
}


function exportCSV(filename, csv){
    if(csv == null) csv = simulatorMap.toCSV();
    if(filename == null) filename = 'export.csv';
    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    var data = encodeURI(csv);
    var link;
    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}


function _carListToJSON(){
    var result = []; 
    for(var i=0;i<carList.length;i++){
        var inStr = carList[i].toString();
        var obj = JSON.parse(inStr);
        result.push(obj);
    }
    return result;
}

function getAppInfo(){
    var [tiles, trafficComponents] = simulatorMap.toJSON();
    return JSON.stringify({
        'numHeight':simulatorMap.numH, 
        'numWidth':simulatorMap.numW,
        'tiles':tiles ,
        'trafficComponents' : trafficComponents, 
        'cars' : _carListToJSON()
    });
}



function exportJSON(fileName, json){
    if(json == null) json = getAppInfo(); 
    if (fileName == null) fileName = 'export.json';

    json = "data:text/json;charset=utf-8," + json;
    var data = encodeURI(json); 
    var link; 
    link = document.createElement('a');
    link.setAttribute('href', data); 
    link.setAttribute('download', fileName); 
    link.click(); 
}


var degree = 0;
/**
 * THis rotate the car and arrow help user visualize the dir
 */
function rotateVisualization(){
    degree = (degree+90)%360;//ensure to be in range [0,270]
    $('.visualize-car-orientation').css({
      'transform': 'rotate(' + degree + 'deg)',
      '-ms-transform': 'rotate(' + degree + 'deg)',
      '-moz-transform': 'rotate(' + degree + 'deg)',
      '-webkit-transform': 'rotate(' + degree + 'deg)',
      '-o-transform': 'rotate(' + degree + 'deg)'
    });
}

function loadCSV(e){
    var data = null;
    var file = e.target.files[0];

    var reader = new FileReader();
    reader.readAsText(file);
    simMap = [];
    reader.onload = function(event){
        var csvData = event.target.result;
        simulatorMap.setupMapFromCSV(csvData);
        renderer.render(stage);
    }// end on load. 
    
}// end loadCSV(e) 



function setupMapFromJSON(jsonObj){
    var numHeight = jsonObj['numHeight'];
    var numWidth = jsonObj['numWidth'];


    var tiles = jsonObj['tiles'];


    simulatorMap = new SimulatorMap(stage, renderer, numWidth, numHeight, tileSize);

    for(var y=0;y<numHeight;y++){
        for(var x=0;x<numWidth;x++){
            simulatorMap.simMap[y][x] = new Tile(tiles[y][x].classType, tileSize);
            simulatorMap.simMap[y][x].setXY(x*tileSize, y*tileSize);
            simulatorMap.simMap[y][x].setInteractive();
            simulatorMap.simMap[y][x].setIndexXY(x, y); 
            stage.addChild(simulatorMap.simMap[y][x].tileClass);
        }
    }

    //load car
    var carListObjs = jsonObj['cars'];
    carList = [];
    for(var i=0;i<carListObjs.length;i++){
        var c = carListObjs[i]; 
        var car = new Car(c['pixi.position.x'], c['pixi.position.y'],
                          c['xIndex'], c['yIndex'], c['direction']);
        stage.addChild(car); 
        carList.push(car);
    }
    renderer.render(stage);

}



function loadJSON(e){
    var data = null;
    var file = e.target.files[0];

    var reader = new FileReader();
    reader.readAsText(file);
    simMap = [];
    reader.onload = function(event){
        var jsonData = JSON.parse(event.target.result);
        setupMapFromJSON(jsonData);
        renderer.render(stage);
    }// end on load. 
}



