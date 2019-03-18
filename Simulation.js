class SimulationApp{
	constructor(stage, renderer){
		this.carList = []; 
		this.trafficComponentList = [];

		this.stage = stage; 
		this.renderer = renderer; 
		this.simulationMap = new SimulatorMap(this.stage, this.renderer, WIDTH/tileSize, HEIGHT/tileSize, tileSize);
		this.simulationMap.setupMap();
		this.renderer.render(this.stage);
		this.restartState;
	}

	setupMapFromJSON(jsonObj){
	    var numHeight = jsonObj['numHeight'];
	    var numWidth = jsonObj['numWidth'];



	    var tiles = jsonObj['tiles'];


	    this.simulatorMap = new SimulatorMap(this.stage, this.renderer, numWidth, numHeight, tileSize);

	    for(var y=0;y<numHeight;y++){
	        for(var x=0;x<numWidth;x++){
	            this.simulatorMap.simMap[y][x] = new Tile(tiles[y][x].classType, tileSize);
	            this.simulatorMap.simMap[y][x].setXY(x*tileSize, y*tileSize);
	            this.simulatorMap.simMap[y][x].setInteractive();
	            this.simulatorMap.simMap[y][x].setIndexXY(x, y); 
	            this.stage.addChild(this.simulatorMap.simMap[y][x].tileClass);
	            this.renderer.render(this.stage);
	        }
	    }
	    var carListObjs = jsonObj['cars'];
	    this.carList = [];
	    for(var i=0;i<carListObjs.length;i++){
	        var c = carListObjs[i]; 
	        var car = new Car(c['pixi.position.x'], c['pixi.position.y'],
	                          c['xIndex'], c['yIndex'], c['direction']);
	        this.stage.addChild(car); 
	        this.renderer.render(this.stage);
	        this.carList.push(car);
	    }
	}
	_carListToJSON(){
	    var result = []; 
	    for(var i=0;i<this.carList.length;i++){
	        var inStr = this.carList[i].toString();
	        var obj = JSON.parse(inStr);
	        result.push(obj);
	    }
	    return result;
	}	

	getAppInfo(softwaretype){
	    return JSON.stringify({
	        'numHeight': this.simulatorMap.numH, 
	        'numWidth': this.simulatorMap.numW,
	        'tiles': this.simulatorMap.toJSON(softwaretype), 
	        'cars' : this._carListToJSON()
	    });
	}

	//@Static
	getCarNextState(car){
		var newState = null;
		var nextTile = {
			'>' : (car.xIndex < this.simulatorMap.numW-2)? 
					this.simulatorMap.simMap[car.yIndex][car.xIndex+1].generalType:
					'end-road', 
			'<' : (car.xIndex > 1)?
					this.simulatorMap.simMap[car.yIndex][car.xIndex-1].generalType:
					'end-road',
			'v' : (car.yIndex < this.simulatorMap.numH-2)?
					this.simulatorMap.simMap[car.yIndex+1][car.xIndex].generalType:
					'end-road',
			'^' : (car.yIndex > 1)?
					this.simulatorMap.simMap[car.yIndex-1][car.xIndex].generalType:
					'end-road'
		};
		var transition = {
			'idle' : 'acel',
			'stop' : 'idle', 
			'acel' : 'regular', 
			'regular' : 'regular'
		}; 
		var prevState = car.state;

		if(nextTile[car.direction] == 'road'){

			newState = transition[prevState];
		}else if(nextTile[car.direction] == 'traffic-light' || 
				 nextTile[car.direction] == 'stop-sign'){
			newState = nextTile[car.direction].carEnter(car);

			if(newState == 'not-movable'){
				newState = 'stop'; 
			}else if(newState == 'movable'){
				newState = transition[prevState];
			}
		}else if(nextTile[car.direction] == 'end-road'){
			newState = 'stop';
		}
		return newState;
	}

	updateSimulation(){
		for(var i=0;i<this.carList.length;i++){
			var car = this.carList[i]; 
			car.move(this.getCarNextState(car));
		}

		//TODO: update component list as well
		for(var i=0;i<this.trafficComponentList.length;i++){

		}
	}

	restartSimulation(){
		this.setupMapFromJSON(this.restartState);
	}

}

var distBetween2Tile = 1/8; //mile 
var TIME_UNIT = 10;//100 ms
function mapToRange(x, rangex1, rangex2, toRangex1, toRangex2){
	return (x - rangex1) / (rangex2 - rangex1) * (toRangex2 - toRangex1) + toRangex1;
}

var stage = new PIXI.Stage(0x66FF99);
var renderer = new PIXI.autoDetectRenderer(
    WIDTH,
    HEIGHT,
    {view:document.getElementById("game-canvas")}
);

let simulationApp = new SimulationApp(stage, renderer);
var paused = true;
var oldTime = Date.now();
var tick = 0;

var tickCount = 0;
function animate() {
    var newTime = Date.now();
    var deltaTime = newTime - oldTime;
    oldTime = newTime;	
 	tick += deltaTime; 
    if (deltaTime < 0) deltaTime = 0;
    if (deltaTime > 1000) deltaTime = 1000;
    var deltaFrame = deltaTime * 60 / 1000; //1.0 is for single frame
	
    // update your game there
    //start game loop. 
    // 
	if(tick > TIME_UNIT){// update every 100MS
		tick = 0; // restart the tick 
		// console.log('global tick', tickCount);
		tickCount+=1;

		//start simulation action here
		simulationApp.updateSimulation();
		// console.log(simulationApp._carListToJSON());
	}


    renderer.render(stage);
    if(!paused)
    	requestAnimationFrame(animate);
}


// Event Handler
document.getElementById("uploadjson").addEventListener("change",loadJSON, true);

function loadJSON(e){
    var data = null;
    var file = e.target.files[0];

    var reader = new FileReader();
    reader.readAsText(file);
    simMap = [];
    reader.onload = function(event){
        var jsonData = JSON.parse(event.target.result);
        simulationApp.setupMapFromJSON(jsonData);
        simulationApp.restartState = jsonData;
    }// end on load. 
}

function exportJSON(fileName, json, softwaretype){
    if(json == null) json = simulationApp.getAppInfo(softwaretype); 
    if (fileName == null) fileName = 'export.json';

    json = "data:text/json;charset=utf-8," + json;
    var data = encodeURI(json); 
    var link; 
    link = document.createElement('a');
    link.setAttribute('href', data); 
    link.setAttribute('download', fileName); 
    link.click(); 
}

function startStopSimulationHandler(){
	paused = !paused;//toggle
	if(!paused)
		requestAnimationFrame(animate);
}
function restartSimulatorHandler(){
	paused = true;
	simulationApp.restartSimulation();
}

//handle range speed slider
$('#simulationSpeedSlider').on('input', function() {
  TIME_UNIT = mapToRange(this.value, this.min, this.max, 1, 1000);
});