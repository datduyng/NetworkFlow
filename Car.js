function Car(x, y, xIndex, yIndex,  degree){
	this.texture = PIXI.Texture.fromImage(spritePath['car']);
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
	

	//Car Simulation Attribute
	this.initalSpeed = 60; //mph
	this.speed = 120; //mph
	this.tick = 0;//timer keep to track in between 2 tile. Instead of keeping distance traveled
	this.state = 'idle';//'idle', 'regular', 'STOP', 

	this.gapTime = {
		'idle' : 100, // tick
		// 'regular' : distBetween2Tile / this.speed * 3600 / (TIME_UNIT/1000), // tick
		// 'acel' : distBetween2Tile / this.initalSpeed * 3600 / (TIME_UNIT/1000) // tick
		'regular' : 60,
		'moving-in-intersection' : 60,
		'acel' : 100,
		'idle-intersection' : 10,
		'turn' :  20
	};
	this.track = 0.0;

	this.turningDirection = null;// use to set new target direction
	this.turningPhase = 1;
	this.globalTraveled = 0.0;
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

Car.prototype.setRotation = function(degree){
	if(typeof degree == 'number'){
		this.direction = this.deg2dir[degree];
		this.rotation = degree * Math.PI / 180;
	}
	else{
		this.direction = degree;
		this.rotation = this.dir2degree[degree] * Math.PI / 180;
	}
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

Car.prototype.adjustCarVisualization = function(totalDist){
	//TODO: make the adjustment become smoother. 
	this.moveDistance(totalDist);
}


Car.prototype.getCarNextState = function(simulationMap){
	var newState = null;
	var nextTile = {
		'>' : (this.xIndex < simulationMap.numW-2)? 
				simulationMap.simMap[this.yIndex][this.xIndex+1].tileClass:
				'end-road', 
		'<' : (this.xIndex > 1)?
				simulationMap.simMap[this.yIndex][this.xIndex-1].tileClass:
				'end-road',
		'v' : (this.yIndex < simulationMap.numH-2)?
				simulationMap.simMap[this.yIndex+1][this.xIndex].tileClass:
				'end-road',
		'^' : (this.yIndex > 1)?
				simulationMap.simMap[this.yIndex-1][this.xIndex].tileClass:
				'end-road'
	};
	this.prevState = this.state;
	if(nextTile[this.direction].generalType == 'road'){

		newState = this.transition[this.prevState];
	}else if(nextTile[this.direction].generalType == 'traffic-light'){
		if(this.prevState != 'moving-in-intersection')
			newState = nextTile[this.direction].carEnter(this);
		
		if(newState == 'not-movable' && this.state != 'moving-in-intersection'){
			newState = 'stop-intersection'; 
		}else if(newState == 'movable'){
			// decide new Direction.
			//sampling random directions. 
			var randomDirection = getRandomChar(nextTile[this.direction].builtDirections);
			this.turningDirection = randomDirection;
			if(this.direction != this.turningDirection){
				newState = 'turn';
			}else {
				newState = this.transition[this.prevState];
			}
		}
	}else if(nextTile[this.direction].generalType == 'stop-sign'){
		newState = nextTile[this.direction].carEnter(this);
	}else if(nextTile[this.direction].generalType == 'end-road'){
		console.log("end road stop");
		newState = 'STOP';
	}

	console.log("Car", this.id, newState, 'prev', this.prevState);
	return newState;
}



Car.prototype.move = function(simulationMap){
	// console.log('curent state', this.state);
	var nextState = this.getCarNextState(simulationMap);
	if(nextState == 'STOP'){//high priority
		this.state = 'STOP';
	}
	if(this.state == 'idle' || this.state == 'idle-intersection'){
		if(this.tick / this.gapTime[this.state] >= 1.0){
			this.state = this.getCarNextState(simulationMap);;
			this.tick = 0;// reset timer
		}

	}else if(this.state == 'acel'){
		var distanceTraveled = tileSize / this.gapTime[this.state];
		this.track += distanceTraveled;
		this.moveDistance(distanceTraveled);
		if((this.tick / this.gapTime[this.state]) >= 1.0){
			this.track=0.0;
			this.updateCarTilePosition();
			if(this.direction == '>' || this.direction == '<')
				this.adjustCarVisualization(Math.abs(Math.max(this.xIndex*tileSize+25, this.position.x)) - Math.min(this.xIndex*tileSize+25, this.position.x));
			else if(this.direction == '^' || this.direction == 'v')
				this.adjustCarVisualization(Math.abs(Math.max(this.yIndex*tileSize+25, this.position.y)) - Math.min(this.yIndex*tileSize+25, this.position.y));
			
			this.state = this.getCarNextState(simulationMap);;
			this.tick = 0;//restart timer
		}

	}else if(this.state == 'regular' || this.state == 'moving-in-intersection'){
		var distanceTraveled = tileSize / this.gapTime[this.state];
		this.moveDistance(distanceTraveled);
		if((this.tick / this.gapTime[this.state]) >= 1.0){
			this.updateCarTilePosition()
			if(this.direction == '>' || this.direction == '<')
				this.adjustCarVisualization(Math.abs(Math.max(this.xIndex*tileSize+25, this.position.x)) - Math.min(this.xIndex*tileSize+25, this.position.x));
			else if(this.direction == '^' || this.direction == 'v')
				this.adjustCarVisualization(Math.abs(Math.max(this.yIndex*tileSize+25, this.position.y)) - Math.min(this.yIndex*tileSize+25, this.position.y));
			
			this.state = this.getCarNextState(simulationMap);;
			this.tick = 0;//restart tick timer
		}
	}else if(this.state == 'turn'){
		if(this.tick % this.gapTime[this.state] == 0){
			var turn = this.decideTurnLeftOrRight()
			this.turnTeleport(turn);
			this.tick = 0; 
			this.state = this.getCarNextState(simulationMap);;
			this.direction = this.turningDirection;
		}
	}else if(this.state == 'STOP' || this.state == 'stop-intersection'){
		this.state = this.getCarNextState(simulationMap);;
	}
	this.tick+=1;
}


Car.prototype.decideTurnLeftOrRight = function(){
	//decide to turn left or right
	var newDeg = this.dir2degree[this.turningDirection];
	var oldDeg = this.dir2degree[this.direction];
	console.log("new deg", newDeg);
	console.log("old deg", oldDeg);
	var turn = 'straight'; //'uturn', 'right', 'left', or 'straight' 
	this.opposite = {
		'right' : 'left',
		'left' : 'right',
		'straight' : 'uturn',
		'uturn' : 'straight'
	};

	if(newDeg - oldDeg > 0) turn='right';
	else if(newDeg - oldDeg < 0) turn='left';
	else turn='straight';

						 console.log("turn?", turn);
	if(Math.abs(newDeg-oldDeg) == 270){
		turn = this.opposite[turn];
	}else if(Math.abs(newDeg - oldDeg) == 180){
		turn = 'uturn';
	}

	return turn;
}


Car.prototype.turnRight = function(){
	if(this.direction == '^'){
		this.xIndex += 1; 
		this.yIndex -= 1;
	}else if(this.direction == 'v'){
		this.xIndex -= 1;
		this.yIndex += 1; 
	}else if(this.direction == '>'){
		this.xIndex += 1;
		this.yIndex += 1; 
	}else if(this.direction == '<'){
		this.xIndex -= 1; 
		this.yIndex -= 1;
	}
}

Car.prototype.turnLeft = function(){
	if(this.direction == '^'){
		this.xIndex -= 1; 
		this.yIndex -= 1;
	}else if(this.direction == 'v'){
		this.xIndex += 1;
		this.yIndex += 1; 
	}else if(this.direction == '>'){
		this.xIndex += 1;
		this.yIndex -= 1; 
	}else if(this.direction == '<'){
		this.xIndex -= 1; 
		this.yIndex += 1;
	}
}

Car.prototype.moveStraight = function(){
	if(this.direction == '^'){
		// this.xIndex -= 1; 
		this.yIndex -= 2;
	}else if(this.direction == 'v'){
		// this.xIndex += 1;
		this.yIndex += 2; 
	}else if(this.direction == '>'){
		this.xIndex += 2;
		// this.yIndex -= 1; 
	}else if(this.direction == '<'){
		this.xIndex -= 2; 
		// this.yIndex += 1;
	}
}

Car.prototype.turnTeleport= function(turn){
	console.log("turn dir" , turn)
	if(turn == 'left'){
		this.turnLeft();
	}else if(turn == 'right'){
		this.turnRight();
	}else if(turn == 'uturn'){
		//nothing. new direction is enough info already
	}else if(turn == 'straight'){
		this.moveStraight();
	}
	this.drawAt(this.xIndex, this.yIndex); 
}

/**
 * draw at index base on direction
 */
Car.prototype.drawAt = function(xIndex, yIndex){
	var x = tileSize *xIndex + tileSize/2;
	var y = tileSize *yIndex + tileSize/2;
	this.setXY(x, y);
	this.setRotation(this.turningDirection);

}

Car.prototype.uturn= function(){
	console.log("TO BE DEVELOP - UTURN method");
	alert("TO BE DEV _ UTURN method")
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
