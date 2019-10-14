/*
 * This Object is the abstraction of the social robot simulator scenario.
 * It handles the layout and behaviour of a certain simulator scenario.
 * It provides a step function which uses and updates the state of the dwenguino board.
 *
 */
function DwenguinoSimulationScenarioSocialRobot(){
    if (!(this instanceof DwenguinoSimulationScenarioSocialRobot)){
      return new DwenguinoSimulationScenarioSocialRobot();
    }
    //call super prototype
    DwenguinoSimulationScenario.call(this);

    //init robot state
    this.initSimulationState();
  
  }
  
  /* @brief Initializes the simulator robot.
   * This resets the simulation state.
   *
   * @param containerIdSelector The jquery selector of the conainer to put the robot display.
   *
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.initSimulationState = function(containerIdSelector){
    // init superclass
     DwenguinoSimulationScenario.prototype.initSimulationState.call(this);
     //init robot state
     this.initSocialRobot();

     //load images for the simulation canvas
     //this.loadImages();

   }
  
  /* @brief Initializes the simulator social robot display.
   * This function puts all the nececary visuals inside the canvas with the id sim_canvas.
   * Additionally, it sets up the state of the simulated robot.
   * The function also resets the internal state of the simulation so the display is initialized from its original position.
   *
   * @param containerIdSelector The jquery selector of the conainer to put the robot display.
   *
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.initSimulationDisplay = function(containerIdSelector){
    // init superclass
    DwenguinoSimulationScenario.prototype.initSimulationDisplay.call(this);

    // Reset the simulation state
    this.initSimulationState();

    //Init the display elements
    var container = $(containerIdSelector);
    var simulationContainer = $("<div>").attr("id", "sim_container");

    //Add resize listerner to the conainer and update width and height accordingly
    var self = this;
    new ResizeSensor(simulationContainer, function() {
      self.containerWidth = simulationContainer.width();
      self.containerHeight = simulationContainer.height();
    });

    // //Init the simulation canvas element in which the social robot will be displayed
    // var simCanvas = $("<canvas>").attr("id", "sim_canvas");
    
    // simulationContainer.append(simCanvas);
    container.empty();
    container.append(simulationContainer);

    // Set new element styles
    $(containerIdSelector).css("position", "relative")

    $("#sim_container")
    .css("position", "relative")
    .css("width", "100%")
    .css("height", "100%")
    .css("box-sizing", "border-box");

    // var sim_canvas = document.getElementById('sim_canvas');

    // // set initial canvas dimensions
    // sim_canvas.setAttribute('width', window.innerWidth);
    // sim_canvas.setAttribute('height', window.innerHeight);

    // // Get DPI
    // let dpi = window.devicePixelRatio;

    // if (sim_canvas.getContext) {
    //     var ctx = sim_canvas.getContext('2d');
    //     this.drawSimulationCanvas = new DwenguinoDrawSimulationCanvas(sim_canvas, ctx);

    //     function fix_dpi() {
    //       // Get CSS height, the + prefix casts it to an integer
    //       // Slice method gets rid of "px"
    //       let style_height = +getComputedStyle(sim_canvas).getPropertyValue("height").slice(0, -2);
    //       let style_width = +getComputedStyle(sim_canvas).getPropertyValue("width").slice(0, -2);
    //       sim_canvas.setAttribute('height', style_height * dpi);
    //       sim_canvas.setAttribute('width', style_width * dpi);
    //     }

    this.drawSimulationDisplay();

    //     window.addEventListener('resize', resizeCanvas, false);

    //     function resizeCanvas() {
    //       fix_dpi();
    //       self.drawSimulationDisplay();
    //     }

    //     $("#sim_stop").click(function() {
    //       self.initSimulationDisplay();
    //     });
        
    // } else {
    //   // canvas unsupported
    //   console.log("The simulation canvas is not supported by your browser")
    // }
  };

  /**
   * This function draws the initial state of the simulation canvases
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.drawSimulationDisplay = function() {
    // console.log("drawSimDisp");
    // console.log($(".sim_canvas"));
    // console.log(document.getElementsByClassName('sim_canvas'));
    // /* TODO clear canvases */
    // $(".sim_canvas").each(function( index ) {
    //   if ($( this ).getContext) {
    //     var ctx = ($( this )).getContext('2d');
    //     ctx.clearRect(0, 0, this.sim_canvas.width, this.sim_canvas.height);
    //     console.log( "canvas cleared" );
    //   }
    // }); 

    // this.drawSimulationCanvas.clearCanvas();

    // this.drawSimulationCanvas.drawServo(this.robot.servo1);
    // this.drawSimulationCanvas.drawServo(this.robot.servo2);
  
    // this.drawSimulationCanvas.drawLed(this.robot.led1);
    // this.drawSimulationCanvas.drawLed(this.robot.led2);
  };
  
  /* @brief updates the simulation state and display
   * This function updates the simulation state and display using the supplied board state.
   *
   * @param boardState The state of the Dwenguino board.
   * @return The updated Dwenguino board state.
   *
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.updateScenario = function(dwenguinoState){
    DwenguinoSimulationScenario.prototype.updateScenario.call(this, dwenguinoState);
    var newScenarioState = this.updateScenarioState(dwenguinoState);
    this.updateScenarioDisplay(dwenguinoState);
    return newScenarioState;
  };
  
  /* @brief updates the simulation state
   * This function updates the simulation state using the supplied board state.
   *
   * @param boardState The state of the Dwenguino board. It has the following structure:
   * {
     lcdContent: new Array(2),
     buzzer: {
       osc: null,
       audiocontext: null,
       tonePlaying: 0
     },
     servoAngles: [0, 0],
     motorSpeeds: [0, 0],
     leds: [0,0,0,0,0,0,0,0,0],
     buttons: [1,1,1,1,1],
     sonarDistance: 50
   }
   * @return The updated Dwenguino board state.
   *
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.updateScenarioState = function(dwenguinoState){
    DwenguinoSimulationScenario.prototype.updateScenarioState.call(this, dwenguinoState);
    
    // var angle1 = dwenguinoState.servoAngles[0];
    // var angle2 = dwenguinoState.servoAngles[1];

    // this.robot.servo1.position.prevAngle = this.robot.servo1.position.angle;
    // this.robot.servo2.position.prevAngle = this.robot.servo2.position.angle;
    // this.robot.servo1.position.angle = angle1;  
    // this.robot.servo2.position.angle = angle2;

    // var led1 = dwenguinoState.leds[1];
    // var led2 = dwenguinoState.leds[2];
    // this.robot.led1.state = led1;
    // this.robot.led2.state = led2;

    return dwenguinoState;
  };
  
  /* @brief updates the simulation display
   * This function updates the simulation display using the supplied board state.
   *
   * @param boardState The state of the Dwenguino board.
   *
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.updateScenarioDisplay = function(dwenguinoState){
    DwenguinoSimulationScenario.prototype.updateScenarioDisplay.call(this, dwenguinoState);
    this.drawSimulationDisplay();
  };

  /* @brief Initializes the social robot state for the simulation canvas
   * 
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.initSocialRobot = function(containerIdSelector){
    this.robot = {
      numberOfServos: 0,
      numberOfLeds: 0,
      numberOfPirs: 0,
      imgServo: './img/board/servo_movement.png',
      imgPir: './img/board/pir.png',
    };
 };

 DwenguinoSimulationScenarioSocialRobot.prototype.addServo = function(){
    this.robot.numberOfServos += 1;
    var id = this.robot.numberOfServos;

    $('#sim_container').append("<div id='sim_servo"+id+"' class='sim_element draggable'>"+MSG.simulator['servo']+" "+id+"</div>");
    $('#sim_servo' + id).append("<canvas id='sim_servo_canvas" +id+"' class='sim_canvas'></canvas>");

    this.robot['servo' + id] = {};
    this.robot['servo' + id].width = 150;
    this.robot['servo' + id].height = 75;
    this.robot['servo' + id].x = 0;
    this.robot['servo' + id].y = 0;
    this.robot['servo' + id].angle = 0;
    this.robot['servo' + id].prevAngle = 0;
    this.robot['servo' + id].image = new Image();
    this.robot['servo' + id].image.src = this.robot.imgServo;
    this.robot['servo' + id].backgroundcolor = '#0a3c7a';
 };

DwenguinoSimulationScenarioSocialRobot.prototype.removeServo = function(){
  var id = this.robot.numberOfServos;
  $("#sim_servo"+ id + "").remove();

  delete this.robot['servo' + id];
  this.robot.numberOfServos -= 1;
};

DwenguinoSimulationScenarioSocialRobot.prototype.addLed = function(){
  this.robot.numberOfLeds += 1;
  var id = this.robot.numberOfLeds;

  $('#sim_container').append("<div id='sim_led"+id+"' class='sim_element draggable'>"+MSG.simulator['led']+" "+id+"</div>");
  $('#sim_led' + id).append("<canvas id='sim_led_canvas" +id+"' class='sim_canvas'></canvas>");
  
  this.robot['led' + id] = {};
  this.robot['led' + id].radius = 30;
  this.robot['led' + id].x = 0;
  this.robot['led' + id].y = 0;
  this.robot['led' + id].oncolor = 'yellow';
  this.robot['led' + id].offcolor = 'gray';
  this.robot['led' + id].bordercolor = 'black';
  this.robot['led' + id].state = 0;
};

DwenguinoSimulationScenarioSocialRobot.prototype.removeLed = function(){
  var id = this.robot.numberOfLeds;
  $("#sim_led"+ id + "").remove();

  delete this.robot['led' + id];
  this.robot.numberOfLeds -= 1;
};

DwenguinoSimulationScenarioSocialRobot.prototype.addPir = function(){
  this.robot.numberOfPirs += 1;
  var id = this.robot.numberOfPirs;

  $('#sim_container').append("<div id='sim_pir"+id+"' class='sim_element draggable'>"+MSG.simulator['pir']+" "+id+"</div>");
  $('#sim_pir' + id).append("<canvas id='sim_pir_canvas" +id+"' class='sim_canvas'></canvas>");
  
  this.robot['pir' + id] = {};
  this.robot['pir' + id].state = 0;
  console.log(this.robot);
};

DwenguinoSimulationScenarioSocialRobot.prototype.removePir = function(){
  var id = this.robot.numberOfPirs;
  $("#sim_pir"+ id + "").remove();

  delete this.robot['pir' + id];
  this.robot.numberOfPirs -= 1;
  console.log(this.robot);
};

 /* @brief Load all images that are used by the simulation canvas
  * This function loads all images that are being used by the simulation canvas 
  * to display the social robot
  */
//  DwenguinoSimulationScenarioSocialRobot.prototype.loadImages = function(containerIdSelector){
//     this.robot.servo1.image.src = './img/board/servo_movement.png';
//     this.robot.servo2.image.src = './img/board/servo_movement.png';
//  }
  