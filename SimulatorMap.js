
function SimulatorMap(stage, renderer, numW, numH, tileSize){
	this.width; 
	this.height; 
	this.tileSize = tileSize;
	this.numW = numW;
	this.numH = numH;
    this.stage = stage; 
    this.renderer = renderer;
    this._initMap();
}

this.width = WIDTH; 
this.height = HEIGHT;

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
    for(var y=0;y<lines.length;y++){
        tokens = lines[y].split(',');
        if(y == 12)
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
	    this.simMap[i] = new Array(this.numW);
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
            this.stage.addChild(this.simMap[y][x].tileClass);
        }
    }
}

SimulatorMap.prototype.toCSV = function(){
    var csv = "";
    for(var y =0;y<this.numH;y++){
        for(var x=0;x<this.numW;x++){
            csv += this.simMap[y][x].toString();
            if(x != this.numW-1)
            	csv += ',';
        }
        csv += '\n';
    }
    return csv;
}



SimulatorMap.prototype.getTileObjects = function(x, y){

    if(this.simMap[y][x].type == "stop-sign" || 
       this.simMap[y][x].type == "traffic-light"){
        var possibleDirections = ""; 

        if(y < this.numH-2){
            if(this.simMap[y+1][x].type == "road-horizontal" || this.simMap[y+1][x].type == "road-verticle"){
                possibleDirections += "v";
            }
        }
        
        if(y > 0)  
            if(this.simMap[y-1][x].type == "road-horizontal" || this.simMap[y-1][x].type == 'road-verticle')
                possibleDirections += "^";
        
        if(x < this.numW-2)
            if(this.simMap[y][x+1].type == "road-horizontal" || this.simMap[y][x+1].type == 'road-verticle')
                possibleDirections += ">";
            

        if(x > 0)
            if(this.simMap[y][x-1].type =="road-horizontal" || this.simMap[y][x-1].type == 'road-verticle')
                possibleDirections += "<";
            
        return {
            "generalType" : this.simMap[y][x].tileClass.generalType,
            "classType" : this.simMap[y][x].tileClass.classType,
            "builtDirections" : possibleDirections
        };
    }

    return {
        "generalType" : this.simMap[y][x].tileClass.generalType,
        "classType" : this.simMap[y][x].tileClass.classType
    };


}

//base on: http://actionsnippet.com/?p=1227
SimulatorMap.prototype.toJSON = function(){
    var result = []; 
    for(i = 0;i < this.numH;i++){
        result[i] = new Array(this.numW);
    }

    for(var y=0;y<this.numH;y++){
        for(var x=0;x<this.numW;x++){
            // result[y][x] = this.simMap[y][x].toString();
            result[y][x] = this.getTileObjects(x, y);
        }
    }
    return result;
}


