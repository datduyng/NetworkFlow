function SimulatorMap(stage, width, height, tileSize){
	this.width = width; 
	this.height = height; 
	this.tileSize = tileSize;
	this.numW = this.width/tileSize;
	this.numH = this.height/tileSize;
    this.stage = stage; 
    this._initMap();
}

SimulatorMap.prototype._clearMap = function(){
    for(var x =0;x<this.numW;x++)
        for(var y=0;y<this.numH;y++)
            this.stage.removeChild(this.simMap[y][x]);
}


SimulatorMap.prototype.setupMapFromCSV = function(csvString){

    this._clearMap();
    var lines = csvString.split('\n');
    this.numH = lines.length;
    this.numW = lines[0].split(',').length;
    var tokens = []; 
    
    this._initMap();
    console.log('line_lathn'+lines.length);
    for(var y=0;y<lines.length;y++){
        tokens = lines[y].split(',');
        if(y == 12)
            console.log('Spcial'+tokens);
        for(var x=0;x<this.numW;x++){
            if(tokens[x] == ""|| tokens[x] == null) {
                console.log("Error When Loading");
                return; 
            }
            this.simMap[y][x] = new Tile(tokens[x],this.tileSize);
            this.simMap[y][x].setXY(x*this.tileSize, y*this.tileSize);
            //setup sprite event here
            this.simMap[y][x].setInteractive();
            this.simMap[y][x].setIndexXY(x, y); 
            this.stage.addChild(this.simMap[y][x]);
        }
    }
}

SimulatorMap.prototype._initMap = function() {
    this.simMap = [];
	for(i = 0;i < this.numH;i++){
	    this.  simMap[i] = new Array(this.numW);
	}
};

SimulatorMap.prototype.setupMap = function(){
    for(var x =0;x<this.numW;x++){
        for(var y=0;y<this.numH;y++){
            this.simMap[y][x] = new Tile('grass',this.tileSize);
            this.simMap[y][x].setXY(x*this.tileSize, y*this.tileSize);
            //setup sprite event here
            this.simMap[y][x].setInteractive();
            this.simMap[y][x].setIndexXY(x, y); 
            this.stage.addChild(this.simMap[y][x]);
        }
    }
}

SimulatorMap.prototype.toCSV = function(){
    var csv = "";
    for(var y =0;y<this.numH;y++){
        for(var x=0;x<this.numW;x++){
            console.log('y'+y+' x ' + x);
            csv += this.simMap[y][x].type;
            if(x != this.numW-1)
            	csv += ',';
        }
        csv += '\n';
    }
    return csv;
}
