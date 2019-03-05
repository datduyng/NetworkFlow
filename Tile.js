function Tile(type, tileSize){
	this.type = type; 

	var texture;
	if(this.type === 'grass'){
		texture = PIXI.Texture.fromImage(spritePath[0]);
	}else if(this.type === 'ground'){
		texture = PIXI.Texture.fromImage(spritePath[1]);
	}
	//inheritance with Sprite class
	PIXI.Sprite.call(this, texture, tileSize, tileSize);
	this.position.x = 0;// set initial position
	this.position.y = 0;
}
Tile.prototype = Object.create(PIXI.Sprite.prototype);



// function of Tile class
Tile.prototype.setX = function(x){
	this.position.x = x;
}
Tile.prototype.setY = function(y){
	this.position.y = y;
}

Tile.prototype.swapTexture = function(type){
	this.type = type; 

	var texture;
	if(this.type === 'grass'){
		texture = PIXI.Texture.fromImage(spritePath[0]);
	}else if(this.type === 'ground'){
		texture = PIXI.Texture.fromImage(spritePath[1]);
	}else if(this.type === 'road-horizontal'){
		texture = PIXI.Texture.fromImage(spritePath[2]);
	}else if(this.type === 'road-verticle'){
		texture = PIXI.Texture.fromImage(spritePath[3]);
	}else if(this.type === 'intersection'){
		texture = PIXI.Texture.fromImage(spritePath[4]);
	}else if(this.type === 'construction-man'){
		texture = PIXI.Texture.fromImage(spritePath[5]);
	}else if(this.type === 'construction-barrier'){
		texture = PIXI.Texture.fromImage(spritePath[6]);
	}else{
        console.log("Tile Nothing");
    }
	this.texture = texture;
    
}

Tile.prototype.setInteractive = function(){
	this.interactive = true;
    // this.on('touchmove', (event) => {
    //     console.log("hover click");     
    // }); 
    this.on('mouseover', (event) => {
        console.log("hover");
        this.tint = 0xB27D7D;
        if(down){// if hover and mouse down
            console.log("hover and mouse down");
            //build here
            this.swapTexture(currentTileType)
        }
        renderer.render(stage);
    }).on('mouseout', (event) => {
        console.log("mouseout");
        // if(!hold){
        	this.tint = 0xFFFFFF;
            renderer.render(stage);
        // }
        
    }).on('mousedown', (event) => {
        console.log("mousedown");
        down = true;
        hold = true;
        // this.destroy();
        // var texture = texture = PIXI.Texture.fromImage(spritePath[0]);
        // this(texture );
        // this.setTexture('ground');
       	this.swapTexture(currentTileType);
        renderer.render(stage);
        console.log(this);
        // build here
        // app.stage.
       //handle event
    }).on('mouseup', (event) => {
        console.log("mouseup");
        down = false;
        hold = false;

        // let rect = new PIXI.Graphics();
        // app.stage.
       //handle event
    });
}
