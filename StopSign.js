

function StopSign(classType){
	this.texture = PIXI.Texture.fromImage(spritePath[classType]);
	PIXI.Sprite.call(this, this.texture, tileSize, tileSize);
	this.classType = classType; 
	this.generalType = "stop-sign";
}
StopSign.prototype = Object.create(PIXI.Sprite.prototype);