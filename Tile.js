function Tile(type, tileSize){
	this.type = type; 

	this.texture;
	this.swapTexture(type);// configure the right
    // texture for tiel
	//inheritance with Sprite class
	PIXI.Sprite.call(this, this.texture, tileSize, tileSize);
	this.position.x = 0;// set initial position
	this.position.y = 0;
    this.indexX = -1;
    this.indexY = -1;
}
Tile.prototype = Object.create(PIXI.Sprite.prototype);



Tile.prototype.setIndexXY = function(xIndex, yIndex){
    this.indexX = xIndex;
    this.indexY = yIndex;
}

// function of Tile class
Tile.prototype.setXY = function(x, y){
	this.position.x = x;
    this.position.y = y; 
}

Tile.prototype.swapTexture = function(type){
    if(type != 'car'){//change tile to new type// except for car
        this.type = type;
    }

	if(type == 'grass'){
		this.texture = PIXI.Texture.fromImage(spritePath[type]);
	}else if(type == 'ground'){
		this.texture = PIXI.Texture.fromImage(spritePath[type]);
	}else if(type == 'road-horizontal'){
		this.texture = PIXI.Texture.fromImage(spritePath[type]);
	}else if(type == 'road-verticle'){
		this.texture = PIXI.Texture.fromImage(spritePath[type]);
	}else if(type == 'stop-sign'){
		this.texture = PIXI.Texture.fromImage(spritePath[type]);
	}else if(type == 'traffic-light'){
        this.texture = PIXI.Texture.fromImage(spritePath[type])
    }else if(type == 'construction-man'){
		this.texture = PIXI.Texture.fromImage(spritePath[type]);
	}else if(type == 'construction-barrier'){
		this.texture = PIXI.Texture.fromImage(spritePath[type]);
	}else if(type == 'car'){
        var x = this.position.x + tileSize/2;
        var y = this.position.y + tileSize/2;

        var car = new Car(x, y, degree);
        stage.addChild(car);
        renderer.render(stage);

        carList.push(car);
    }else{
        console.log("Tile Nothing");
    }
    
}

Tile.prototype.setInteractive = function(){
	this.interactive = true;
    this.on('mouseover', (event) => {
        this.tint = 0xB27D7D;
        if(down){// if hover and mouse down
            //build here
            this.swapTexture(currentTileType)
        }
        renderer.render(stage);
    }).on('mouseout', (event) => {
        	this.tint = 0xFFFFFF;
            renderer.render(stage);
    }).on('mousedown', (event) => {
        down = true;
        hold = true;
       	this.swapTexture(currentTileType);
        renderer.render(stage);
    }).on('mouseup', (event) => {
        down = false;
        hold = false;
    });
}


Tile.prototype.getContent = function(){
}


Tile.prototype.toString = function(){
    if(this.type == 'road-horizontal' || this.type == 'road-verticle'){
         return 'road';
    }else if(this.type == 'construction-man' || this.type == 'construction-barrier' || 
       this.type == 'grass'){
        return 'ground';
    }
    return this.type;
}
