function Tile(classType, tileSize){
    // this.swapTexture(generalType);// configure the right
    // texture for tiel
    //inheritance with Sprite class

    this.createTileClassType(classType, false);
    this.tileSize = tileSize;

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
    this.click = 0; //avoid double click problem
    this.tileClass.on('mouseover', (event) => {
        this.tileClass.tint = 0xB27D7D;
        if(down){// if hover and mouse down
            //build here
            if(currentTileType != 'car' && currentTileType != 'boat') this.createTileClassType(currentTileType, true)
        }
        renderer.render(stage);
    }).on('mouseout', (event) => {
        this.tileClass.tint = 0xFFFFFF;
        renderer.render(stage);
    }).on('mousedown', (event) => {
        down = true;
        this.click += 1; 
        hold = true;
        //ensure user to put 1 vehicle down. Cannot fix this double clicking pixi bug
        if((currentTileType == 'car' || currentTileType == 'boat') && this.click % 2 == 0){
            this.createObjectOnTop(currentTileType);
            renderer.render(stage);
            this.click = 0;
        }else{
            this.createTileClassType(currentTileType, true);
        }
        
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
        return this.tileClass.generalType;
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

Tile.prototype.createTileClassType = function(classType, interactive){
    if(classType == "grass" || classType == "ground" || classType=="construction-man"||
       classType == "construction-barrier" ||
       classType == 'water'){
        var newTile = new Ground(classType);
        

        //after remove then transfre info
        if (this.tileClass != null) {
            this.getOldTileInfo(newTile);
            stage.removeChild(this.tileClass);
        }
        this.tileClass = newTile;
        if(interactive) this.setInteractive();
        stage.addChild(this.tileClass);


    }else if(classType == "traffic-light"){
        componentIdAssigner += 1;
        var newTile = new TrafficLight(componentIdAssigner, classType);
        //after remove then transfre info
        if (this.tileClass != null) {
            this.getOldTileInfo(newTile);
            stage.removeChild(this.tileClass);
            this.tileClass = null;
        }
        this.tileClass = newTile;
        if(interactive)this.setInteractive();
        stage.addChild(this.tileClass);

    }else if(classType == "stop-sign"){
        componentIdAssigner += 1;
        var newTile = new StopSign(componentIdAssigner, classType);
        //after remove then transfre info
        if (this.tileClass != null) {
            this.getOldTileInfo(newTile);
            stage.removeChild(this.tileClass);
            this.tileClass = null;
        }
        this.tileClass = newTile;
        if(interactive)this.setInteractive();
        stage.addChild(this.tileClass);
    }else if(classType == "road-horizontal" || 
             classType == "road-verticle"){
        var newTile = new Road(classType);
        //after remove then transfre info
        if (this.tileClass != null) {
            this.getOldTileInfo(newTile);
            stage.removeChild(this.tileClass);
            this.tileClass = null;
        }
        this.tileClass = newTile;
        stage.addChild(this.tileClass);
        if(interactive)this.setInteractive();
    }else{
        console.log("Invalid classType", classType);

    }
    
}

Tile.prototype.createObjectOnTop = function(classType){
    if(classType == "car"){
        carIdAssigner += 1; 
        var x = this.tileClass.position.x + tileSize/2;
        var y = this.tileClass.position.y + tileSize/2;

        var car = new Car(x, y, this.xIndex, this.yIndex, carDegree);
        stage.addChild(car);
        renderer.render(stage);

        carList.push(car);
    }else if(classType == "boat"){
        carIdAssigner += 1; 
        var x = this.tileClass.position.x + tileSize/2;
        var y = this.tileClass.position.y + tileSize/2;

        var boat = new Boat(x, y, this.xIndex, this.yIndex, boatDegree);
        stage.addChild(boat);
        renderer.render(stage);

        boatList.push(boat);
    }
}
