function Road(classType){
	this.texture = PIXI.Texture.fromImage(spritePath[classType]);
	PIXI.Sprite.call(this, this.texture, tileSize, tileSize);
	this.classType = classType;
	this.generalType = "road"; 
}
Road.prototype = Object.create(PIXI.Sprite.prototype);