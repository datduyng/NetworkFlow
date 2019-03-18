function Tile(classType, tileSize){
    // this.swapTexture(generalType);// configure the right
    // texture for tiel
    //inheritance with Sprite class

    this.createTileClassType(classType);

    this.tileClass.position.x = 0;// set initial position
    this.tileClass.position.y = 0;
    this.xIndex = -1;
    this.yIndex = -1;
}


Tile.prototype.setIndexXY = function(xIndex, yIndex){
    this.xIndex = xIndex;
    this.yIndex = yIndex;
}

// function of Tile class
Tile.prototype.setXY = function(x, y){
    this.tileClass.position.x = x;
    this.tileClass.position.y = y; 
}



Tile.prototype.setInteractive = function(){
    this.tileClass.interactive = true;
    this.tileClass.on('mouseover', (event) => {
        this.tileClass.tint = 0xB27D7D;
        if(down){// if hover and mouse down
            //build here
            this.createTileClassType(currentTileType)
        }
        renderer.render(stage);
    }).on('mouseout', (event) => {
        this.tileClass.tint = 0xFFFFFF;
        renderer.render(stage);
    }).on('mousedown', (event) => {
        down = true;
        hold = true;
        this.createTileClassType(currentTileType);
        if(currentTileType == 'car') this.createObjectOnTop(currentTileType);
        // renderer.render(stage);
    }).on('mouseup', (event) => {
        down = false;
        hold = false;
    });
}


Tile.prototype.getContent = function(){
}


Tile.prototype.toString = function(softwaretype){
    if(softwaretype == 'javafx'){
        if(this.tileClass.tileClass.classType == 'road-horizontal' || this.tileClass.classType == 'road-verticle'){
             return 'road';
        }else if(this.tileClass.classType == 'construction-man' || this.tileClass.classType == 'construction-barrier' || 
           this.tileClass.classType == 'grass'){
            return 'ground';
        }
        return this.generalType;
    }
    return this.tileClass.classType;

}

/**
 * Added info to @params tile by references
 */
Tile.prototype.getOldTileInfo = function(tile){
    tile.position.x = this.tileClass.position.x;
    tile.position.y = this.tileClass.position.y; 
}

Tile.prototype.createTileClassType = function(classType){
    if(classType == "grass" || classType == "ground" || classType=="construction-man"||
       classType == "construction-barrier"){
        var newTile = new Ground(classType);
        

        //after remove then transfre info
        if (this.tileClass != null) {
            this.getOldTileInfo(newTile);
            stage.removeChild(this.tileClass);
        }
        this.tileClass = newTile;
        this.setInteractive();
        stage.addChild(this.tileClass);
        this.generalType = "ground";
    }else if(classType == "traffic-light"){
        var newTile = new TrafficLight(classType);
        //after remove then transfre info
        if (this.tileClass != null) {
            this.getOldTileInfo(newTile);
            stage.removeChild(this.tileClass);
        }
        this.tileClass = newTile;
        this.setInteractive();
        stage.addChild(this.tileClass);
        this.generalType = "traffic-light";
    }else if(classType == "stop-sign"){
        var newTile = new StopSign(classType);
        //after remove then transfre info
        if (this.tileClass != null) {
            this.getOldTileInfo(newTile);
            stage.removeChild(this.tileClass);
        }
        this.tileClass = newTile;
        this.setInteractive();
        stage.addChild(this.tileClass);
        this.generalType = "stop-sign";
    }else if(classType == "road-horizontal" || 
             classType == "road-verticle"){
        var newTile = new Road(classType);
        //after remove then transfre info
        if (this.tileClass != null) {
            this.getOldTileInfo(newTile);
            stage.removeChild(this.tileClass);
        }
        this.tileClass = newTile;
        stage.addChild(this.tileClass);
        this.setInteractive();
        this.generalType = "road";
    }else{
        console.log("Invalid classType", classType);
    }
    
}

Tile.prototype.createObjectOnTop = function(classType){
    if(classType == "car"){
            console.log("classtype car");
            var x = this.tileClass.position.x + tileSize/2;
            var y = this.tileClass.position.y + tileSize/2;

            var car = new Car(x, y, this.xIndex, this.yIndex, degree);
            stage.addChild(car);
            renderer.render(stage);

            carList.push(car);
    }
}