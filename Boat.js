/******
 * last update 4/6/19
 * this object will be dev is time permited
 */

function Boat(x, y, xIndex, yIndex,  degree){
	this.texture = PIXI.Texture.fromImage(spritePath['boat']);
	PIXI.Sprite.call(this, this.texture, tileSize/2,tileSize); 
	this.position.x = x;// set initial position
	this.position.y = y;
	this.xIndex = xIndex; 
	this.yIndex = yIndex; 
	this.id; //TODO: config id attr 

	this.deg2dir = {
		0:'>',
		90:'v',
		180:'<',
		270:'^',
	};

	this.dir2degree = {
		'>' : 0,
		'v' : 90,
		'<' : 180,
		'^' : 270,
	};

	this.transition = {
		'idle' : 'acel',
		'STOP' : 'idle', 
		'acel' : 'regular', 
		'regular' : 'regular',
		'stop-intersection' : 'idle-intersection',
		'idle-intersection' : 'moving-in-intersection',
		'moving-in-intersection' : 'regular',
		'turn' : 'regular'
	};

	this.setRotation(degree); 
	this.anchor.set(0.5, 0); //set pivot point. at top middle. 
	

	//Boat Simulation Attribute
	this.initalSpeed = 60; //mph
	this.speed = 120; //mph
	this.tick = 0;//timer keep to track in between 2 tile. Instead of keeping distance traveled
	this.state = 'idle';//'idle', 'regular', 'STOP', 

	this.gapTime = {
		'idle' : 10, // tick
		// 'regular' : distBetween2Tile / this.speed * 3600 / (TIME_UNIT/1000), // tick
		// 'acel' : distBetween2Tile / this.initalSpeed * 3600 / (TIME_UNIT/1000) // tick
		'regular' : 30,
		'moving-in-intersection' : 40,
		'acel' : 10,
		'idle-intersection' : 20,
		'turn' :  150
	};
	this.track = 0.0;
	this.down; //track on click
	this.turningDirection = null;// use to set new target direction
	this.turningPhase = 1;
	this.globalTraveled = 0.0;
	this.intersectionPassing = null;
	this.classType = 'car';
}
Boat.prototype = Object.create(PIXI.Sprite.prototype);

// function of Boat class
Boat.prototype.setXY = function(x, y){
	this.position.x = x;
	this.position.y = y; 
}

Boat.prototype.setXYIndex = function(xIndex, yIndex){
	this.xIndex = xIndex; 
	this.yIndex = yIndex;
}

Boat.prototype.setRotation = function(degree){
	if(typeof degree == 'number'){
		this.direction = this.deg2dir[degree];
		this.rotation = degree * Math.PI / 180;
	}
	else{
		this.direction = degree;
		this.rotation = this.dir2degree[degree] * Math.PI / 180;
	}
}


Boat.prototype.updateCarTilePosition = function(){
	
	if(this.direction == '>'){
		this.setXYIndex(this.xIndex+1, this.yIndex); 
	}else if (this.direction == '<'){
		this.setXYIndex(this.xIndex-1, this.yIndex);
	}else if(this.direction == '^'){
		this.setXYIndex(this.xIndex, this.yIndex-1);
	}else if(this.direction == 'v'){
		this.setXYIndex(this.xIndex, this.yIndex+1);
	}
}

Boat.prototype.moveDistance = function(distance){
	// console.log("distance", distance)
	//scale up to our actual software pixel
	if(this.direction == '>'){
		this.setXY(this.position.x+distance, this.position.y); 
	}else if (this.direction == '<'){
		this.setXY(this.position.x-distance, this.position.y);
	}else if(this.direction == '^'){
		this.setXY(this.position.x, this.position.y-distance);
	}else if(this.direction == 'v'){
		this.setXY(this.position.x, this.position.y+distance);
	}
}

Boat.prototype.adjustCarVisualization = function(totalDist){
	//TODO: make the adjustment become smoother. 
	this.moveDistance(totalDist);
}



Boat.prototype.toString = function(){
	return JSON.stringify({
		'id' 	 : this.id,
		'nextTile' : this.nextTile,
		'xIndex' : this.xIndex,
		'yIndex' : this.yIndex,
		'pixi.position.x' : this.position.x, 
		'pixi.position.y' : this.position.y,
		'direction' : this.direction,
		'tick' : this.tick, 
		'state' : this.state
	});
}

Boat.prototype.setInteractive = function(){
    this.interactive = true;
    this.click = 0; //avoid double click problem
    this.on('mouseover', (event) => {
        this.tint = 0xB27D7D;
        renderer.render(stage);
    }).on('mouseout', (event) => {
        this.tint = 0xFFFFFF;
        renderer.render(stage);
    }).on('mousedown', (event) => {
			console.log(this.toString());
    }).on('mouseup', (event) => {
    });
}
