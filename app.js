document.getElementById("uploadcsv").addEventListener("change", loadCSV, true);

//pixijs ex:http://scottmcdonnell.github.io/pixi-examples/index.html?s=demos&f=texture-swap.js&title=Texture%20Swap
var WIDTH =800;
var HEIGHT = 600;

var tileSize = 50;


var stage = new PIXI.Stage(0x66FF99);
var renderer = new PIXI.autoDetectRenderer(
    WIDTH,
    HEIGHT,
    {view:document.getElementById("game-canvas")}
);


//setup simulator map 
var mapX = WIDTH/tileSize, mapY = HEIGHT/tileSize;
var simMap = [];
for(i = 0;i < mapY;i++){
    simMap[i] = new Array(mapX);//.fill(new Tile('grass',tileSize));
}


let sprites = {}; 

PIXI.loader.add(spritePath).load(setup);

let sheet;

function setup(){
    //example load sprite ssheet
    ///SAVE
    // sheet = PIXI.loader.resources['basic/atlas01.json'].spritesheet;
    // sprites.grass = new PIXI.Sprite(sheet.textures['grass.png']);
    //// sprites.grass = new PIXI.Sprite.fromImage("./basic/grass.png");
    //SAVE
    _setupMap();
    renderer.render(stage);
}

function _setupMap(){
    for(var x =0;x<mapX;x++){
        for(var y=0;y<mapY;y++){
            simMap[y][x] = new Tile('grass',tileSize);
            simMap[y][x].setX(x*tileSize);
            simMap[y][x].setY(y*tileSize);
            //setup sprite event here
            simMap[y][x].setInteractive();
            stage.addChild(simMap[y][x]);
        }
    }
}

function mapToCsvFormat(simMap){
    var csv = "";
    for(var x =0;x<mapX;x++){
        for(var y=0;y<mapY;y++){
            csv += simMap[y][x].type+',';
        }
        csv += '\n';
    }
    return csv;
}

function exportCSV(filename, csv){
    if(csv == null) csv = mapToCsvFormat(simMap);
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

function loadCSV(e){
    console.log("upload changed");
    var data = null;
    var file = e.target.files[0];
    console.log(file);

    var reader = new FileReader();
    reader.readAsText(file);
    simMap = [];
    reader.onload = function(event){
        var csvData = event.target.result;
        var lines = csvData.split('\n');
        var tokens = [];
        for(i = 0;i < lines.length-1;i++){
            simMap[i] = new Array(lines[0].split(',').length-1);
        }

        console.log('height'+simMap.length)
        console.log('width'+simMap[0].length)
        for(var l=0;l<lines.length-1;l++){
            if(lines[l] != null || lines[l] != ""){
                tokens = lines[l].split(',');
                
                //loop through each token in a row
                for(var t=0;t<tokens.length-1;t++){
                    if(tokens[t] == ""|| tokens[t] == null) {
                        console.log("Error When Loading");
                        return; 
                    }
                    // console.log('::'+tokens[t].trim()+'::');
                    simMap[l][t] = new Tile(tokens[t],tileSize);
                    
                    simMap[l][t].setX(t*tileSize);
                    simMap[l][t].setY(l*tileSize);

                    //setup sprite event here
                    simMap[l][t].setInteractive();
                    stage.addChild(simMap[l][t]);
                }
            }
        }
        renderer.render(stage);
    }// end on load. 
    

}// end loadCSV(e) 
