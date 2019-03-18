function Car(x, y, xIndex, yIndex,  degree){
	this.texture = PIXI.Texture.fromImage(spritePath['car']);
	PIXI.Sprite.call(this, this.texture, tileSize/2,tileSize); 
	this.position.x = x;// set initial position
	this.position.y = y;
	this.xIndex = xIndex; 
	this.yIndex = yIndex; 
	this.id; //TODO: config id attr 

	dirMap = {
		0:'>',
		90:'v',
		180:'<',
		270:'^'
	};

	dir2degree = {
		'>' : 0,
		'v' : 90,
		'<' : 180,
		'^' : 270
	};

	if(typeof degree == 'number'){
		this.direction = dirMap[degree];
		this.rotation = degree * Math.PI / 180;
	}
	else{
		this.direction = degree;
		this.rotation = dir2degree[degree] * Math.PI / 180;
	}
	this.anchor.set(0.5, 0); //set pivot point. at top middle. 
	

	//Car Simulation Attribute
	this.initalSpeed = 60; //mph
	this.speed = 120; //mph
	this.tick = 0;//timer keep to track in between 2 tile. Instead of keeping distance traveled
	this.state = 'idle';//'idle', 'regular', 'stop', 

	this.gapTime = {
		'idle' : 1, // tick
		// 'regular' : distBetween2Tile / this.speed * 3600 / (TIME_UNIT/1000), // tick
		// 'acel' : distBetween2Tile / this.initalSpeed * 3600 / (TIME_UNIT/1000) // tick
		'regular' : 60,
		'acel' : 120
	};
}
Car.prototype = Object.create(PIXI.Sprite.prototype);

// function of Car class
Car.prototype.setXY = function(x, y){
	this.position.x = x;
	this.position.y = y; 
}

Car.prototype.setXYIndex = function(xIndex, yIndex){
	this.xIndex = xIndex; 
	this.yIndex = yIndex;
}


Car.prototype.updateCarTilePosition = function(){
	
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

Car.prototype.moveDistance = function(distance){
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

Car.prototype.adjustCarVisualization = function(totalDist){
	//TODO: make the adjustment become smoother. 
	this.moveDistance(totalDist);
}


Car.prototype.move = function(nextState){
	if(nextState == 'stop'){//high priority
		this.state = stop;
	}
	if(this.state == 'idle'){
		if(this.tick / this.gapTime[this.state] >= 1.0){
			this.state = nextState;
		}

	}else if(this.state == 'acel'){
		var distanceTraveled = 1 / this.gapTime[this.state];
		this.moveDistance(distanceTraveled*tileSize );
		if((this.tick / this.gapTime[this.state]) >= 1.0){
			this.updateCarTilePosition();
			if(this.direction == '>' || this.direction == '<')
				//-25 for offset. anchor attop mid
				this.adjustCarVisualization(Math.abs(Math.max(this.xIndex*tileSize, this.position.x-25)) - Math.min(this.xIndex*tileSize, this.position.x-25));
			else if(this.direction == '^' || this.direction == 'v')
				this.adjustCarVisualization(Math.abs(Math.max(this.yIndex*tileSize, this.position.y-25)) - Math.min(this.yIndex*tileSize, this.position.y-25));
			
			this.state = nextState;
			this.tick = 0;//restart timer
		}

	}else if(this.state == 'regular'){
		var distanceTraveled = 1 / this.gapTime[this.state];
		this.moveDistance(distanceTraveled*tileSize);
		if((this.tick / this.gapTime[this.state]) >= 1.0){
			this.updateCarTilePosition()
			if(this.direction == '>' || this.direction == '<')
				this.adjustCarVisualization(Math.abs(Math.max(this.xIndex*tileSize, this.position.x-25)) - Math.min(this.xIndex*tileSize, this.position.x-25));
			else if(this.direction == '^' || this.direction == 'v')
				this.adjustCarVisualization(Math.abs(Math.max(this.yIndex*tileSize, this.position.y-25)) - Math.min(this.yIndex*tileSize, this.position.y-25));
			
			this.state = nextState;
			this.tick = 0;//restart tick timer
		}
	}else if(this.state == 'turn'){
		
	}else if(this.state == 'stop'){

	}
	this.tick+=1;
}


Car.prototype.toString = function(){
	return JSON.stringify({
		'xIndex' : this.xIndex,
		'yIndex' : this.yIndex,
		'pixi.position.x' : this.position.x, 
		'pixi.position.y' : this.position.y,
		'direction' : this.direction,
		'tick' : this.tick, 
		'state' : this.state
	});
}
