function Ground(classType){
	this.texture = PIXI.Texture.fromImage(spritePath[classType]);
	PIXI.Sprite.call(this, this.texture, tileSize, tileSize);
	this.generalType = "ground";
	this.classType = classType; 
}
Ground.prototype = Object.create(PIXI.Sprite.prototype);