

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
	enqueue(element) { this.items.push(element); } 
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

	if(car.state == 'stop-intersection'){
		this.queue.enqueue(car);
		return 'not-movable';//stop when first enter.
	}



	var carReady = this.queue.front();

	console.log('carReady', carReady.id)
	console.log('car', car.id);

	if(carReady.id == car.id){
		console.log("car passing", car.id);
		this.setCarPassing(carReady);
		return 'movable';
	}else{
		// this.setIsCarPassing(false);
		return 'not-movable';
	}
}