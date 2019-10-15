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

    //Init robot state
    this.initSocialRobot();
    
    this.drawSimulation = new DwenguinoDrawSimulationCanvas();
   }
  
  /* @brief Initializes the simulator social robot display.
   * @param containerIdSelector The jquery selector of the conainer to put the robot display.
   *
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.initSimulationDisplay = function(containerIdSelector){
    // init superclass
    DwenguinoSimulationScenario.prototype.initSimulationDisplay.call(this);

    this.drawSimulationDisplay();
  };


  DwenguinoSimulationScenarioSocialRobot.prototype.initSimulation = function(containerIdSelector) {
    // Reset the simulation state
    this.initSimulationState();

    console.log("init simulation display");

    // Load the simulation container
    var container = $(containerIdSelector);
    var simulationContainer = $("<div>").attr("id", "sim_container");

    // Add resize listerner to the conainer and update width and height accordingly
    var self = this;
    new ResizeSensor(simulationContainer, function() {
      self.containerWidth = simulationContainer.width();
      self.containerHeight = simulationContainer.height();
    });

    container.empty();
    container.append(simulationContainer);
  }

  /**
   * This function draws the current robot components in the simulation container
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.drawSimulationDisplay = function() {
    this.drawSimulation.clearCanvases();

    this.drawSimulation.drawLeds(this.robot);
    this.drawSimulation.drawServos(this.robot);
    this.drawSimulation.drawPirs(this.robot);
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

    // TODO rewrite this to a dynamic solution which can handle more leds and servos
    if(this.robot['sim_led_canvas1'] !== undefined){
      this.robot['sim_led_canvas1'].state = dwenguinoState.leds[0];
    }

    if(this.robot['sim_led_canvas2'] !== undefined){
      this.robot['sim_led_canvas2'].state = dwenguinoState.leds[1];
    }

    if(this.robot['sim_servo_canvas1'] !== undefined){
      this.robot['sim_servo_canvas1'].prevAngle = this.robot['sim_servo_canvas1'].angle;
      this.robot['sim_servo_canvas1'].angle = dwenguinoState.servoAngles[0];
    }

    if(this.robot['sim_servo_canvas2'] !== undefined){
      this.robot['sim_servo_canvas2'].prevAngle = this.robot['sim_servo_canvas2'].angle;
      this.robot['sim_servo_canvas2'].angle = dwenguinoState.servoAngles[1];
    }

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

  /* @brief Initializes the social robot state.
   * 
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.initSocialRobot = function(containerIdSelector){
    console.log("init social robot");
    this.robot = {
      numberOfServos: 0,
      numberOfLeds: 0,
      numberOfPirs: 0,
      imgServo: './img/board/servo_movement.png',
      imgPir: './img/board/pir.png',
    };
 };

 /**
  * Resets the robot components of the simulation container to their initial state.
  */
 DwenguinoSimulationScenarioSocialRobot.prototype.resetSocialRobot = function(containerIdSelector){
    // TODO: implement
 }

 /**
  * Add a new servo to the simulation container.
  */
 DwenguinoSimulationScenarioSocialRobot.prototype.addServo = function(){
    this.robot.numberOfServos += 1;
    var id = this.robot.numberOfServos;

    $('#sim_container').append("<div id='sim_servo"+id+"' class='sim_element sim_element_servo draggable'>"+MSG.simulator['servo']+" "+id+"</div>");
    $('#sim_servo' + id).append("<canvas id='sim_servo_canvas" +id+"' class='sim_canvas servo_canvas'></canvas>");

    this.robot['sim_servo_canvas' + id] = {};
    this.robot['sim_servo_canvas' + id].width = 150;
    this.robot['sim_servo_canvas' + id].height = 75;
    this.robot['sim_servo_canvas' + id].x = 0;
    this.robot['sim_servo_canvas' + id].y = 0;
    this.robot['sim_servo_canvas' + id].angle = 0;
    this.robot['sim_servo_canvas' + id].prevAngle = 0;
    this.robot['sim_servo_canvas' + id].image = new Image();
    this.robot['sim_servo_canvas' + id].image.src = this.robot.imgServo;
    this.robot['sim_servo_canvas' + id].backgroundcolor = '#0a3c7a';

    var canvas = document.getElementById('sim_servo_canvas'+id);
    this.drawSimulation.configureCanvasDimensions(canvas);
    this.drawSimulationDisplay();
 };

 /**
  * Remove the most recent created servo from the simulation container.
  */
DwenguinoSimulationScenarioSocialRobot.prototype.removeServo = function(){
  var id = this.robot.numberOfServos;
  $("#sim_servo"+ id + "").remove();

  delete this.robot['sim_servo_canvas' + id];
  this.robot.numberOfServos -= 1;
};

/**
 * Add a new LED to the simulation container.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.addLed = function(){
  this.robot.numberOfLeds += 1;
  var i = this.robot.numberOfLeds;
  var id = 0;
  if(i < 9){
    id = i-1;
  } else {
    id = 13;
  }

  $('#sim_container').append("<div id='sim_led"+i+"' class='sim_element sim_element_led draggable'>"+MSG.simulator['led']+" "+id+"</div>");
  $('#sim_led' + i).append("<canvas id='sim_led_canvas" +i+"' class='sim_canvas led_canvas'></canvas>");

  this.robot['sim_led_canvas' + i] = {};
  this.robot['sim_led_canvas' + i].radius = 15;
  this.robot['sim_led_canvas' + i].x = 0;
  this.robot['sim_led_canvas' + i].y = 0;
  this.robot['sim_led_canvas' + i].oncolor = 'yellow';
  this.robot['sim_led_canvas' + i].offcolor = 'gray';
  this.robot['sim_led_canvas' + i].bordercolor = 'black';
  this.robot['sim_led_canvas' + i].state = 0;

  var canvas = document.getElementById('sim_led_canvas'+i);
  this.drawSimulation.configureCanvasDimensions(canvas);
  this.drawSimulationDisplay();
};

/**
 * Remove the most recent created LED from the simulation container.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.removeLed = function(){
  var id = this.robot.numberOfLeds;
  $("#sim_led"+ id + "").remove();

  delete this.robot['sim_led_canvas' + id];
  this.robot.numberOfLeds -= 1;
};

/**
 * Add a new PIR sensor to the simulation container.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.addPir = function(){
  this.robot.numberOfPirs += 1;
  var id = this.robot.numberOfPirs;

  var width = 286;
  var height = 276;
  this.robot['sim_pir_canvas' + id] = {};
  this.robot['sim_pir_canvas' + id].width = width;
  this.robot['sim_pir_canvas' + id].height = height;
  this.robot['sim_pir_canvas' + id].image = new Image();
  this.robot['sim_pir_canvas' + id].image.src = this.robot.imgPir;
  this.robot['sim_pir_canvas' + id].state = 0;

  $('#sim_container').append("<div id='sim_pir"+id+"' class='sim_element sim_element_pir draggable'>"+MSG.simulator['pir']+" "+id+"</div>");
  $('#sim_pir' + id).append("<canvas id='sim_pir_canvas" +id+"' class='sim_canvas pir_canvas' width='"+width+"' height='"+height+"'></canvas>");
  
  var self = this;

  // Add PIR event handler here
  $("#rc_pir_button").on('mousedown', function() {
    if (document.getElementById('rc_pir_button').className === "sim_button") {
      document.getElementById('rc_pir_button').className = "sim_button sim_button_pushed";
      self.robot['sim_pir_canvas1'].state = 1;
    }
  });

  $("#rc_pir_button").on('mouseup', function() {
    if (document.getElementById('rc_pir_button').className === "sim_button sim_button_pushed") {
      document.getElementById('rc_pir_button').className = "sim_button";
      self.robot['sim_pir_canvas1'].state = 0;
    }
  });

  this.drawSimulation.configureCanvasDimensions(canvas);
  this.drawSimulationDisplay();
};

/**
 * Remove the most recent created PIR sensor from the simulation container.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.removePir = function(){
  var id = this.robot.numberOfPirs;
  $("#sim_pir"+ id + "").remove();

  delete this.robot['sim_pir_canvas' + id];
  this.robot.numberOfPirs -= 1;
  console.log(this.robot);
};