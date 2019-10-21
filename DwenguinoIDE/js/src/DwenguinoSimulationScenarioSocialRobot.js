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

    this.drawSimulation = new DwenguinoDrawSimulationCanvas();

    //Init robot state
    this.initSocialRobot();

    this.checkLocalStorage();
    
   }
  
  /* @brief Initializes the simulator social robot display.
   * @param containerIdSelector The jquery selector of the conainer to put the robot display.
   *
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.initSimulationDisplay = function(containerIdSelector){
    // init superclass
    DwenguinoSimulationScenario.prototype.initSimulationDisplay.call(this);

    this.drawSimulationDisplay();

    var self = this;
    $("#sim_stop").click(function() {
      let timer = setTimeout(() => {
        self.resetSocialRobot();
        self.drawSimulationDisplay();
      }, 500);
    });
  };


  DwenguinoSimulationScenarioSocialRobot.prototype.initSimulation = function(containerIdSelector) {
    
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

    // Reset the simulation state
    this.initSimulationState();

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
    /**
     * TODO: implement: if local storage contains robot components adjust the menu to 
     * display the current number of robot components of each type. 
     * Additionally the robot components need to be addded again at a specific position
     */

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
  * Resets the robot components of the simulation container to their initial state. This function doesn't
  * remove the components from the container or move them around, but merely puts them in their initial off state.
  */
 DwenguinoSimulationScenarioSocialRobot.prototype.resetSocialRobot = function(containerIdSelector){
    for(var i = 1; i <= this.robot.numberOfServos; i++){
      this.robot['sim_servo_canvas' + i].x = 0;
      this.robot['sim_servo_canvas' + i].y = 0;
      this.robot['sim_servo_canvas' + i].angle = 0;
      this.robot['sim_servo_canvas' + i].prevAngle = 0;
    }

    for(var i = 1; i <= this.robot.numberOfLeds; i++){
      this.robot['sim_led_canvas' + i].x = 0;
      this.robot['sim_led_canvas' + i].y = 0;
      this.robot['sim_led_canvas' + i].state = 0;
    }

    for(var i = 1; i <= this.robot.numberOfPirs; i++){
      this.robot['sim_pir_canvas' + i].state = 0;
    }
 }

 /**
  * Add a new servo to the simulation container.
  */
 DwenguinoSimulationScenarioSocialRobot.prototype.addServo = function(draw = true, offsetLeft = 5, offsetTop = 5){
    this.robot.numberOfServos += 1;
    var id = this.robot.numberOfServos;

    if(draw){
      $('#sim_container').append("<div id='sim_servo"+id+"' class='sim_element sim_element_servo draggable'>"+MSG.simulator['servo']+" "+id+"</div>");
      $('#sim_servo' + id).append("<canvas id='sim_servo_canvas" +id+"' class='sim_canvas servo_canvas'></canvas>");
    }

    // console.log('transform in addservo');
    // console.log(transformX);
    // console.log(transformY);
    this.robot['sim_servo_canvas' + id] = {};
    this.robot['sim_servo_canvas' + id].width = 100;
    this.robot['sim_servo_canvas' + id].height = 50;
    this.robot['sim_servo_canvas' + id].x = 0;
    this.robot['sim_servo_canvas' + id].y = 0;
    this.robot['sim_servo_canvas' + id].offsetLeft = offsetLeft;
    this.robot['sim_servo_canvas' + id].offsetTop = offsetTop;
    // this.robot['sim_servo_canvas' + id].transformX = transformX;
    // this.robot['sim_servo_canvas' + id].transformY = transformY;
    this.robot['sim_servo_canvas' + id].angle = 0;
    this.robot['sim_servo_canvas' + id].prevAngle = 0;
    this.robot['sim_servo_canvas' + id].image = new Image();
    this.robot['sim_servo_canvas' + id].image.src = this.robot.imgServo;
    this.robot['sim_servo_canvas' + id].backgroundcolor = '#206499';

    console.log(this.robot['sim_servo_canvas' + id]);
    if(draw){
      var canvas = document.getElementById('sim_servo_canvas'+id);
      this.drawSimulation.configureCanvasDimensions(canvas);
      this.drawSimulationDisplay();
    }
 };

 /**
  * Remove the most recent created servo from the simulation container.
  */
DwenguinoSimulationScenarioSocialRobot.prototype.removeServo = function(){
  var id = this.robot.numberOfServos;
  $("#sim_servo"+ id + "").remove();

  delete this.robot['sim_servo_canvas' + id];
  this.robot.numberOfServos -= 1;
  this.drawSimulationDisplay();
};

/**
 * Add a new LED to the simulation container.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.addLed = function(draw = true, x = 0, y = 0){
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
  this.robot['sim_led_canvas' + i].radius = 10;
  this.robot['sim_led_canvas' + i].x = 0;
  this.robot['sim_led_canvas' + i].y = 0;
  this.robot['sim_led_canvas' + i].oncolor = 'yellow';
  this.robot['sim_led_canvas' + i].offcolor = 'gray';
  this.robot['sim_led_canvas' + i].bordercolor = 'black';
  this.robot['sim_led_canvas' + i].state = 0;

  var canvas = document.getElementById('sim_led_canvas'+i);
  this.drawSimulation.configureCanvasDimensions(canvas);
  if(draw){
    this.drawSimulationDisplay();
  }

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
DwenguinoSimulationScenarioSocialRobot.prototype.addPir = function(draw = true, x = 0, y = 0){
  this.robot.numberOfPirs += 1;
  var id = this.robot.numberOfPirs;

  this.robot['sim_pir_canvas' + id] = {};
  this.robot['sim_pir_canvas' + id].width = 50;
  this.robot['sim_pir_canvas' + id].height = 50;
  this.robot['sim_pir_canvas' + id].image = new Image();
  this.robot['sim_pir_canvas' + id].image.src = this.robot.imgPir;
  this.robot['sim_pir_canvas' + id].state = 0;

  $('#sim_container').append("<div id='sim_pir"+id+"' class='sim_element sim_element_pir draggable'>"+MSG.simulator['pir']+" "+id+"</div>");
  $('#sim_pir' + id).append("<canvas id='sim_pir_canvas" +id+"' class='sim_canvas pir_canvas'></canvas>"); 
  
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

  var canvas = document.getElementById('sim_pir_canvas' +id);
  this.drawSimulation.configureCanvasDimensions(canvas);
  if(draw){
    this.drawSimulationDisplay();
  }
};

/**
 * Remove the most recent created PIR sensor from the simulation container.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.removePir = function(){
  var id = this.robot.numberOfPirs;
  $('#sim_pir'+ id).remove();

  delete this.robot['sim_pir_canvas' + id];
  this.robot.numberOfPirs -= 1;
};

DwenguinoSimulationScenarioSocialRobot.prototype.checkLocalStorage = function(){
  if (window.localStorage) {
    var localStorage = window.localStorage;
    var self = this;

    if(localStorage.getItem('socialRobotScenario')){
      // TODO unpack robot components and then save robot components
      console.log('need to unpack robot components');
      var servos = localStorage.getItem('servos');
      servos = servos.split('+').map(e => e.split(','));
      console.log(servos);
      for(var i = 0; i < servos.length-1; i++){
        this.addServo(false,servos[i][2], servos[i][3]);
      }
    }
  }
}


/**
 * Loads the robot components from the local storage
 */
DwenguinoSimulationScenarioSocialRobot.prototype.loadRobotComponents = function(){
  if (window.localStorage) {
    var localStorage = window.localStorage;
    var self = this;

    if(localStorage.getItem('socialRobotScenario')){
      for(var i = 1; i <= self.robot.numberOfServos; i++){
        $('#sim_container').append("<div id='sim_servo"+i+"' class='sim_element sim_element_servo draggable'>"+MSG.simulator['servo']+" "+i+"</div>");
        
        var topOffset = self.robot['sim_servo_canvas'+i].offsetTop;
        var leftOffset = self.robot['sim_servo_canvas'+i].offsetLeft;

        $('#sim_servo' + i).css('top', topOffset + 'px');
        $('#sim_servo' + i).css('left', leftOffset + 'px');
        
        $('#sim_servo' + i).append("<canvas id='sim_servo_canvas" +i+"' class='sim_canvas servo_canvas'></canvas>");
        
        var canvas = document.getElementById('sim_servo_canvas'+i);
        self.drawSimulation.configureCanvasDimensions(canvas);
        self.drawSimulationDisplay();
      }

      this.saveRobotComponents();

    } else {
      // from now save current state
      this.saveRobotComponents();
    }
  }
}

/**
 * Periodically saves the current robot components to the local storage,
 * so that when the page gets refreshed they can be reloaded.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.saveRobotComponents = function(){
  if (window.localStorage) {
    var localStorage = window.localStorage;
    var self = this;

    // Try this
    try {

      // Set the interval and autosave every second
      setInterval(function() {
        
        var servos = '';
        for(var i = 1; i <= self.robot.numberOfServos; i++){
          var leftOffset = 0;
          if($('#sim_servo' + i).attr('data-x')){
            leftOffset = parseFloat(self.robot['sim_servo_canvas' + i].offsetLeft) + parseFloat($('#sim_servo' + i).attr('data-x'));
          } else {
            leftOffset = parseFloat(self.robot['sim_servo_canvas' + i].offsetLeft);
          }

          var topOffset = 0;
          if($('#sim_servo' + i).attr('data-x')){
            topOffset = parseFloat(self.robot['sim_servo_canvas' + i].offsetTop) + parseFloat($('#sim_servo' + i).attr('data-y'));
          } else {
            topOffset = parseFloat(self.robot['sim_servo_canvas' + i].offsetTop);
          }

          servos = servos.concat("sim_servo",i,",", "sim_servo_canvas",i,",",leftOffset,",",topOffset, "+");  
        }

        var leds = "";
        for(var i = 1; i <= self.robot.numberOfLeds; i++){
          var element = document.getElementById('sim_led' +i);
          if(element != undefined){
            var rect = element.getBoundingClientRect();
            leds = leds.concat("sim_led",i,",", "sim_led_canvas",i,",",rect.x,",",rect.y,";");
          }
        }

        var pirs = "";
        for(var i = 1; i <= self.robot.numberOfPirs; i++){
          var element = document.getElementById('sim_pir' +i);
          if(element != undefined){
            var rect = element.getBoundingClientRect();
            pirs = pirs.concat("sim_pir",i,",", "sim_pir_canvas",i,",",rect.x,",",rect.y,";");
          }
        }

        localStorage.setItem('socialRobotScenario', 'saved');
        localStorage.setItem('servos', servos);
        localStorage.setItem('leds', leds);
        localStorage.setItem('pirs', pirs);
      }, 1000);

    } catch (e) {

      // If any errors, catch and alert the user
      if (e == QUOTA_EXCEEDED_ERR) {
        alert('Quota exceeded!');
      }
    }

  } else {

    console.log("No local storage");
  }

}

