function TrafficLight(id, classType){
	this.id = id;
	this.texture = PIXI.Texture.fromImage(spritePath['traffic-light-we']);
	PIXI.Sprite.call(this, this.texture, tileSize, tileSize);
	this.classType = classType; 
	this.generalType = "traffic-light";
	this.gapTime = {
		'switchState' : 100
	}
	this.tick = 0;
	this.lightState = 'traffic-light-we';// 'ns' or 'we'


	this.transition = {
		'traffic-light-ns' : 'traffic-light-we', 
		'traffic-light-we' : 'traffic-light-ns',
	};
	this.builtDirections = "";
	//switching
}
TrafficLight.prototype = Object.create(PIXI.Sprite.prototype);

TrafficLight.prototype.update = function(){
	this.tick+=1; 
	if((this.tick % this.gapTime['switchState']) == 0){
		this.tick = 0; 
		this.switchState();
	}
}
TrafficLight.prototype.switchState = function(){
	console.log("Switched state", this.lightState);
	//switch the variable state, and the texture as well
	this.lightState = this.transition[this.lightState];//transition
	this.texture = PIXI.Texture.fromImage(spritePath[this.lightState]);
}

TrafficLight.prototype.carEnter = function(car){
	if(car.direction == '>' || car.direction == '<'){
		if(this.lightState == 'traffic-light-we') return 'movable';
		else if(this.lightState == 'traffic-light-ns' && car.state != 'moving-in-intersection') return 'not-movable';
	}else if(car.direction == '^' || car.direction == 'v'){
		if(this.lightState == 'traffic-light-ns' && car.state != 'moving-in-intersection') return 'movable'; 
		else if(this.lightState == 'traffic-light-we' && car.state != 'moving-in-intersection') return 'not-movable'; 
	}
}

