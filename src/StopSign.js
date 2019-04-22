

//thanks to this quick implementation of queue in JS
//https://www.geeksforgeeks.org/implementation-queue-javascript/
// Queue class 
class Queue 
{ 
    // Array is used to implement a Queue 
    constructor() 
    { 
        this.items = []; 
    } 
	enqueue(element) { 
		if(this.items.indexOf(element) < 0)// if not in list
			this.items.push(element); } 
	dequeue() { 
	    if(this.isEmpty()) 
	        return "Underflow"; 
	    return this.items.shift(); 
	}  
	front() { 
	    if(this.isEmpty()) return "No elements in Queue"; 
	    return this.items[0]; 
	} 
	isEmpty() { return this.items.length == 0; } 

	// printQueue function 
	printQueue() { 
	    var str = ""; 
	    for(var i = 0; i < this.items.length; i++) 
	        str += this.items[i] +" "; 
	    return str; 
	} 

	toString(){
		return JSON.Stringify(this.items());
	}

	toJSON(){
		return this.items();
	}
} 


function StopSign(id, classType){
	this.texture = PIXI.Texture.fromImage(spritePath[classType]);
	PIXI.Sprite.call(this, this.texture, tileSize, tileSize);
	this.classType = classType; 

	this.id = id;
	this.generalType = "stop-sign";
	this.builtDirections = "";

	this.queue = new Queue();
	this.carPassing = null;//this tell if a car is passing a stop-sign
}
StopSign.prototype = Object.create(PIXI.Sprite.prototype);


StopSign.prototype.update = function(){
	//nothing to update
}

StopSign.prototype.setCarPassing = function(carPassing){
	this.carPassing = carPassing;
}
/**
 * This function assume that initially when car enter the stopsign
 * the car is at the state moving. thus, we add the car to the queue.
 * When carEnter is being call again, if car state is 'stop-intersection'
 * then we will not add the car to queue. 
 */
StopSign.prototype.carEnter = function(car){	
	var carReady = this.queue.front();

	if(car.id == carReady.id){
		return 'movable';
	}else{
		return 'not-movable';
	}
}


StopSign.prototype.carOut = function(car){
	var current = this.queue.front();
	if(car.id == current.id)
		this.queue.dequeue();
}

StopSign.prototype.toString = function(){
	return {
		'queue' : (this.queue.items.toString()),
		'id' : this.id,
		'builtDirections': this.builtDirections
	}
}

StopSign.prototype.setInteractive = function(){
    this.interactive = true;
    this.click = 0; //avoid double click problem
    this.on('mouseover', (event) => {
        this.tint = 0xB27D7D;
        renderer.render(stage);
    }).on('mouseout', (event) => {
        this.tint = 0xFFFFFF;
        renderer.render(stage);
    }).on('mousedown', (event) => {
			console.log(this.toString());
    }).on('mouseup', (event) => {
    });
}
