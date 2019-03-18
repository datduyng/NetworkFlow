function TrafficLight(classType){
	this.texture = PIXI.Texture.fromImage(spritePath[classType]);
	PIXI.Sprite.call(this, this.texture, tileSize, tileSize);
	this.classType = classType; 
	this.generalType = "traffic-light";

	
}
TrafficLight.prototype = Object.create(PIXI.Sprite.prototype);

TrafficLight.prototype.carEnter = function(car){

}

