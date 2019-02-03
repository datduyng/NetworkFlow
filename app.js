//pixijs ex:http://scottmcdonnell.github.io/pixi-examples/index.html?s=demos&f=texture-swap.js&title=Texture%20Swap
var resolutionX = 800;
var resolutionY = 600;

var tileSize = 50;

var app = new PIXI.Application(resolutionX, resolutionY);
document.body.appendChild(app.view);


//setup simulator map 
var mapX = 25, mapY = 30;
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


    //init and visulize sprite on screen
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
    // var newTile = new Tile('grass',tileSize);
    // newTile.position.x = 20;
    
    // app.stage.addChild(sprites.grass);
    // app.stage.addChild(sprites.ground);
}

function _setupMap(){

}