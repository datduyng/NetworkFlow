document.getElementById("uploadcsv").addEventListener("change", loadCSV, true);

//pixijs ex:http://scottmcdonnell.github.io/pixi-examples/index.html?s=demos&f=texture-swap.js&title=Texture%20Swap
var resolutionX = 600;
var resolutionY = 400;

var tileSize = 20;

var app = new PIXI.Application({ 
      width: resolutionX,         // default: 800
      height: resolutionY,        // default: 6shou
      antialias: true,    // default: false // smooth the edges of display // does not available on all platofmr
      transparent: false, // default: false
      resolution: 1,       // default: 1
      view:document.getElementById("game-canvas")
    }
  );

app.view.style.position = 'absolute';
app.view.style.left = '50%';
app.view.style.top = '30%';
app.view.style.transform = 'translate3d( -50%, -50%, 0 )';

document.body.appendChild(app.view);


//setup simulator map 
var mapX = resolutionX/tileSize, mapY = resolutionY/tileSize;
var simMap = [];
for(i = 0;i < mapY;i++){
    simMap[i] = new Array(mapX);//.fill(new Tile('grass',tileSize));
}

// var matrix = new Array(5).fill().map(() => new Array(4).fill(0));


let sprites = {}; 
// sprites.grass = new PIXI.Sprite.fromImage("./basic/grass.png");

// sprites.grass.y = 96;
// sprites.grass.x = 100;
// sprites.grass.setInteractive(true);
PIXI.loader.add(spritePath).load(setup);

let sheet;

function setup(){
    //example load sprite ssheet
    ///SAVE
    // sheet = PIXI.loader.resources['basic/atlas01.json'].spritesheet;
    // sprites.grass = new PIXI.Sprite(sheet.textures['grass.png']);
    //SAVE
    _setupMap();

    //init and visulize sprite on screen

    // var newTile = new Tile('grass',tileSize);
    // newTile.position.x = 20;
    
    // app.stage.addChild(sprites.grass);
    // app.stage.addChild(sprites.ground);
}

function _setupMap(){
    for(var x =0;x<mapX;x++){
        for(var y=0;y<mapY;y++){

            simMap[y][x] = new Tile('grass',tileSize);
            //setup sprite event here
            // simMap[y][x].setX(x*tileSize);
            simMap[y][x].position.x = x*tileSize;
            simMap[y][x].position.y = y*tileSize;
            // simMap[y][x].setY(y*tileSize);

            simMap[y][x].setInteractive();
            // console.log(x*tileSize);

            app.stage.addChild(simMap[y][x]);
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
    reader.onload = function(event){
        var csvData = event.target.result;
        var lines = csvData.split('\n');
        var tokens = [];
        for(i = 0;i < mapY;i++){
            simMap[i] = new Array(lines[0].split(',').length);//.fill(new Tile('grass',tileSize));
        }
        for(var l=0;l<lines.length;l++){
            if(lines[l] != null || lines[l] != ""){
                tokens = lines[l].split(',');
                
                //loop through each token in a row
                for(var t=0;t<tokens.length;t++){
                    if(tokens[t] == ""|| tokens[t] == null) continue;
                    console.log(tokens[t]);
                    simMap[l][t] = new Tile(tokens[t].trim(),tileSize);
                    //setup sprite event here
                    // simMap[y][x].setX(x*tileSize);
                    // simMap[l][t].position.x = x*tileSize;
                    // simMap[l][t].position.y = y*tileSize;
                    // simMap[y][x].setY(y*tileSize);

                    simMap[l][t].setInteractive();
                    // console.log(x*tileSize);

                    app.stage.addChild(simMap[l][t]);
                }
            }
        }
        // for each(var line in lines){
        //     console.log("each line:", line);
        // }

    }

}
