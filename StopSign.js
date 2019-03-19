

function StopSign(id, classType){
	this.texture = PIXI.Texture.fromImage(spritePath[classType]);
	PIXI.Sprite.call(this, this.texture, tileSize, tileSize);
	this.classType = classType; 

	this.id = id;
	this.generalType = "stop-sign";
	this.builtDirections = "";
}
StopSign.prototype = Object.create(PIXI.Sprite.prototype);