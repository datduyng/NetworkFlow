function Map(width, height, tileSize){
	this.width = width; 
	this.height = height; 
	this.tileSize = tileSize;
	this.numW = this.width/tileSize;
	this.numH = this.height/tileSize;


	this.simMap = this._initMap();


}


Map.prototype._initMap = function() {
	var simMap = []; 
	for(i = 0;i < this.numH;i++){
	    simMap[i] = new Array(this.numW);
	}
};

Map.prototype._setupMap = function(){
    for(var x =0;x<this.numW;x++){
        for(var y=0;y<this.numH;y++){
            simMap[y][x] = new Tile('grass',tileSize);
            simMap[y][x].setXY(x*tileSize, y*tileSize);
            //setup sprite event here
            simMap[y][x].setInteractive();
            simMap[y][x].setIndexXY(x, y); 
            stage.addChild(simMap[y][x]);
        }
    }
}

Map.prototype.toCSV = function(){
    var csv = "";
    for(var x =0;x<this.numW;x++){
        for(var y=0;y<this.numH;y++){
            csv += simMap[y][x].type;
            if(y != this.numH-1)
            	csv += ',';
        }
        csv += '\n';
    }
    return csv;
}
