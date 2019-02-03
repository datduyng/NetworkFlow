//https://github.com/kittykatattack/learningPixi

// pixi example: http://scottmcdonnell.github.io/pixi-examples/




var WIDTH = 500;
var HEIGHT = 500;

//Create a Pixi Application
// figures out whether to use the Canvas Drawing API or WebGL to render graphics, 
//depending on which is available in the web browser you're using
let app = new PIXI.Application({ 
    width: WIDTH,         // default: 800
    height: HEIGHT,        // default: 600
    antialias: true,    // default: false // smooth the edges of display // does not available on all platofmr
    transparent: false, // default: false
    resolution: 1       // default: 1
  }
);

//change the background 
app.renderer.backgroundColor = 0x0076DE;



//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);


//pixijs text editor: https://pixijs.io/pixi-text-style/#




var style = {
    align: "center",
    dropShadowBlur: 14,
    dropShadowDistance: 9,
    fontFamily: "Verdana, Geneva, sans-serif",
    fontVariant: "small-caps",
    fontWeight: "lighter",
    lineJoin: "bevel",
    miterLimit: 9,
    strokeThickness: 1,
    whiteSpace: "normal"
};

let message = new PIXI.Text("Welcome to \nCity Boost!", style);

var startTextContainer = new PIXI.Container();
startTextContainer.addChild(message);
var reg = startTextContainer.getBounds();
startTextContainer.x = (WIDTH / 2) - (reg.width/2);
startTextContainer.y = (HEIGHT / 2) - (reg.height/2);// scale to center
app.stage.addChild(startTextContainer);



/************************/
//TODO: animated start icon example 
//http://pixijs.download/dev/docs/PIXI.Ticker_.html
// software to create automated sprite. https://www.codeandweb.com/texturepacker/start-download?os=win&bits=64&download=true
/************************/

//load the the image and run the 'setup' function 
// when it is done
// if get an error 'from origin 'null' has been blocked by CORS policy: The response is invalid.'
// chrome block loading images for security reason. 
// solution: run your own server or run some other server. 
// npm install -g http-server
// User:(nmiguelmoura):   http://www.html5gamedevs.com/topic/19748-image-from-origin-file-has-been-blocked-from-loading/
PIXI.loader
	.add("image_name","./images/cat.png",{crossOrigin: 'anonymous'})
	.load(setup);

//This setup function will run when image has loaded
// I think plain setup would jsut display image but probably
// for efficiency reason you want to use the loader
let cat, state;
function setup(){


	// create a new cat sprite when image has loaded
	cat = new PIXI.Sprite.fromImage("./images/cat.png");

	cat.y = 96; 
	cat.vx = 0;
	cat.vy = 0;
	app.stage.addChild(cat);

	//transformation images function is available like
	// cat.rotation, cat.width, cat.height, cat.anchor.x(pivot rotating),...


	//setup keyboard
  let left = keyboard("ArrowLeft"),
      up = keyboard("ArrowUp"),
      right = keyboard("ArrowRight"),
      down = keyboard("ArrowDown");

  //Left arrow key `press` method
	left.press = () => {
		//Change the cat's velocity when the key is pressed
		cat.vx = -5;
		cat.vy = 0;
	};

	//Left arrow key `release` method
	left.release = () => {
		//If the left arrow has been released, and the right arrow isn't down,
		//and the cat isn't moving vertically:
		//Stop the cat
		if (!right.isDown && cat.vy === 0) {
		  cat.vx = 0;
		}
	};

	//Up
	up.press = () => {
		cat.vy = -5;
		cat.vx = 0;
	};
	up.release = () => {
		if (!down.isDown && cat.vx === 0) {
		  cat.vy = 0;
		}
	};

	//Right
	right.press = () => {
		cat.vx = 5;
		cat.vy = 0;
	};
	right.release = () => {
		if (!left.isDown && cat.vy === 0) {
		  cat.vx = 0;
		}
	};

	//Down
	down.press = () => {
		cat.vy = 5;
		cat.vx = 0;
	};
	down.release = () => {
		if (!up.isDown && cat.vx === 0) {
		  cat.vy = 0;
		}
	};
	  //Create the cat sprite
	// // add the cat to the canvas
	// app.stage.addChild(cat);
  //Set the game state
  state = play;
 
  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));
}
//set visible if needed
// cat.visible = false;

function gameLoop(delta){

	//update the current game state;
	state(delta);
}

function play(delta){
	//Use the cat's velocity to make it move
	cat.x += cat.vx;
	cat.y += cat.vy
}


//keyboard object
function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  // const downListener = key.downHandler.bind(key);
  // const upListener = key.upHandler.bind(key);
  
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  
  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key;
}