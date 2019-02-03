    var resolutionX = 800;
    var resolutionY = 600;

    var tileSize = 50;

    var app = new PIXI.Application(resolutionX, resolutionY);
    document.body.appendChild(app.view);


    let sprites = {}; 
    // sprites.grass = new PIXI.Sprite.fromImage("./basic/grass.png");

    // sprites.grass.y = 96;
    // sprites.grass.x = 100;
    // sprites.grass.setInteractive(true);

    var spritePath = [
        "images/sim-asset/grass.png",
        "images/sim-asset/ground.png"
    ];
    PIXI.loader.add(spritePath).load(setup);

    let sheet;

    //note here down is a super global
    // vaiable control drag
    var down = false;
    var hover = false;
    //set up jquery business hanlder
    $(document).on('mousedown', function(){
        down = true;
        console.log("docuemtn down");
    });

    $(document).on('mouseup', function(){
        down = false;
        console.log("docuemtn mouseup");
    });

    function setup(){
        //example load sprite ssheet
        ///SAVE
        // sheet = PIXI.loader.resources['basic/atlas01.json'].spritesheet;
        // sprites.grass = new PIXI.Sprite(sheet.textures['grass.png']);
        //SAVE

        sprites.grass = new PIXI.Sprite.fromImage(spritePath[0]);
        sprites.ground = new PIXI.Sprite.fromImage(spritePath[1]);


        sprites.ground.interactive = true;
        sprites.grass.interactive = true;
        // sprites.grass.on('tap', (event) => {
        //     console.log("tapped");
        //    //handle event
        // });

        sprites.grass.on('touchmove', (event) => {
            console.log("hover click");     
        }); 
        sprites.grass.on('mouseover', (event) => {
            console.log("hover");
            sprites.grass.tint = 0xB27D7D;
            if(down){// if hover and mouse down
                console.log("hover and mouse down");
                //build here
            }


        });
        sprites.grass.on('mouseout', (event) => {
            console.log("mouseout");
            sprites.grass.tint = 0xFFFFFF;
            // sprites.grass.mask = null;
           //handle event
        });

        sprites.grass.on('mousedown', (event) => {
            console.log("mousedown");
            down = true;
            // build here
            // app.stage.
           //handle event
        });
        sprites.grass.on('mouseup', (event) => {
            console.log("mouseup");
            down = false;
            let rect = new PIXI.Graphics();
            // app.stage.
           //handle event
        });

        app.stage.addChild(sprites.grass);
        app.stage.addChild(sprites.ground);
    }

    function _setupMap(){

    }