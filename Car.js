function Car(x, y, degree){
	this.texture = PIXI.Texture.fromImage(spritePath[7]);
	PIXI.Sprite.call(this, this.texture, tileSize/2,tileSize); 
	this.position.x = x;// set initial position
	this.position.y = y;

	this.dirMap = {
		0:'>',
		90:'v',
		180:'<',
		270:'^'
	};
	this.direction = this.dirMap[degree];
	this.anchor.set(0.5, 0); //set pivot point. at top middle. 
	this.rotation = degree * Math.PI / 180;
	renderer.render(stage);
}
Car.prototype = Object.create(PIXI.Sprite.prototype);

// function of Car class
Car.prototype.setX = function(x){
	this.position.x = x;
}
Car.prototype.setY = function(y){
	this.position.y = y;
}

Car.prototype.toString = function(){
	return JSON.stringify({
		'x' : this.position.x,
		'y' : this.position.y,
		'direction' : this.direction,
	});
}
