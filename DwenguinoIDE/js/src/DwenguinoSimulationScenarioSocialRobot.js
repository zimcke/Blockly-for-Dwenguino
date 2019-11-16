const TypesEnum = {
  SERVO: 'servo', 
  LED: 'led', 
  PIR: 'pir',
  SONAR: 'sonar',
  LCD: 'lcd',
  DECORATION: 'decoration'
};
Object.freeze(TypesEnum);

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

    this.scenarioUtils = new DwenguinoScenarioUtils(this);

    //Init robot state
    this.initSocialRobot();

    $('#sim_background').css('background-image', this.robot.imgRobot);
    this.scenarioUtils.contextMenuBackground();

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

    this.initScenarioOptions();
  }

  DwenguinoSimulationScenarioSocialRobot.prototype.initScenarioOptions = function(){
    var self = this;

    var scenarioOptions = $("<div>").attr("id", "scenario_options");
    $('#sim_container').append(scenarioOptions);
    scenarioOptions.append("<div id='load_scenario' class='glyphicon glyphicon-cloud-upload' alt='Load'></div>");
    scenarioOptions.append("<div id='save_scenario' class='glyphicon glyphicon-cloud-download' alt='Save'></div>");

    $("#load_scenario").click(function(){
      self.scenarioUtils.loadScenario();
    });

    $("#save_scenario").click(function(){
      console.log("save");
      var data = self.loadToXml();
      self.scenarioUtils.saveScenario(data);
    });
  }

  DwenguinoSimulationScenarioSocialRobot.prototype.initSimulation = function(containerIdSelector) {
    
    console.log("init simulation display");

    // Make the bottom pane larger
    $('#db_simulator_top_pane').css('height', '35%');
    $('#db_simulator_bottom_pane').css('height', '65%');

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

    var backgroundCanvasId = 'sim_background';

    this.robot[backgroundCanvasId] = {};
    this.robot[backgroundCanvasId].offset = {'left': 0, 'top': 0};
    // this.robot[backgroundCanvasId].image = new Image();
    // this.robot[backgroundCanvasId].image.src = this.robot.imgRobot;

    $('#sim_container').append("<div id='sim_background' class='sim_element draggable'></div>");
    $('#sim_background').css('top', 0 + 'px');
    $('#sim_background').css('left', 0 + 'px');
    

    // Reset the simulation state
    this.initSimulationState();

  }

  /**
   * This function draws the current robot components in the simulation container
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.drawSimulationDisplay = function() {
    console.log('draw Simulation display');
    this.drawSimulation.clearCanvases();
    this.drawSimulation.drawLeds(this.robot);
    this.drawSimulation.drawServos(this.robot);
    this.drawSimulation.drawPirs(this.robot);
    this.drawSimulation.drawSonars(this.robot);
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

    for(var i = 0; i < dwenguinoState.leds.length; i++){
      var ledCanvasId = 'sim_led_canvas' + (i+1);
      if(this.robot[ledCanvasId] !== undefined){
        this.robot[ledCanvasId].state = dwenguinoState.leds[i];
      }
    }

    for(var i = 0; i < dwenguinoState.servoAngles.length; i++){
      var servoCanvasId = 'sim_servo_canvas' + (i+1);
      if(this.robot[servoCanvasId] !== undefined){
        if(this.robot[servoCanvasId].angle != dwenguinoState.servoAngles[i]){
          this.robot[servoCanvasId].prevAngle = this.robot[servoCanvasId].angle;
          this.robot[servoCanvasId].angle = dwenguinoState.servoAngles[i];
        }   
      }
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
      numberOf: {},
      imgServo: './img/board/servo_movement.png',
      imgPir: './img/socialrobot/pir.png',
      imgSonar: './img/board/sonar.png',
      imgRobot: 'url("./img/socialrobot/robot1.png")',
      imgEye: './img/socialrobot/eye.svg',
      imgRightHand: './img/socialrobot/righthand.png',
      imgLeftHand: './img/socialrobot/lefthand.png'
    };
    
    for (const [type, t] of Object.entries(TypesEnum)) {
      this.robot.numberOf[t] = 0;
    }
 };

 /**
  * Resets the robot components of the simulation container to their initial state. This function doesn't
  * remove the components from the container or move them around, but merely puts them in their initial off state.
  */
 DwenguinoSimulationScenarioSocialRobot.prototype.resetSocialRobot = function(containerIdSelector){
    for(var i = 1; i <= this.robot.numberOf[TypesEnum.SERVO]; i++){
      var servoCanvasId = 'sim_servo_canvas' + i;
      this.robot[servoCanvasId].x = 0;
      this.robot[servoCanvasId].y = 30;
      this.robot[servoCanvasId].angle = 0;
      this.robot[servoCanvasId].prevAngle = 0;

    }

    for(var i = 1; i <= this.robot.numberOf[TypesEnum.LED]; i++){
      var ledCanvasId = 'sim_led_canvas' + i;
      this.robot[ledCanvasId].x = 0;
      this.robot[ledCanvasId].y = 0;
      this.robot[ledCanvasId].state = 0;
    }

    for(var i = 1; i <= this.robot.numberOf[TypesEnum.PIR]; i++){
      var pirCanvasId = 'sim_pir_canvas' + i;
      this.robot[pirCanvasId].state = 0;
    }

    if(this.robot.numberOf[TypesEnum.LCD] != 0){
      DwenguinoSimulation.clearLcd();
    }
 }

 /**
  * Add a new servo to the simulation container.
  */
 DwenguinoSimulationScenarioSocialRobot.prototype.addServo = function(draw = true, offsetLeft = 5, offsetTop = 5, state = StatesEnum.PLAIN, width = 100, height = 50, image = this.robot.imgServo, classes = 'sim_canvas servo_canvas'){
    DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("addRobotComponent", TypesEnum.SERVO));

    this.robot.numberOf[TypesEnum.SERVO] += 1;
    var id = this.robot.numberOf[TypesEnum.SERVO];
    var servoCanvasId = 'sim_servo_canvas' + id;

    this.robot[servoCanvasId] = {};
    this.robot[servoCanvasId].width = width;
    this.robot[servoCanvasId].height = height;
    this.robot[servoCanvasId].x = 0;
    this.robot[servoCanvasId].y = 30;
    this.robot[servoCanvasId].offset = {'left': offsetLeft, 'top': offsetTop};
    this.robot[servoCanvasId].angle = 0;
    this.robot[servoCanvasId].prevAngle = 0;
    this.robot[servoCanvasId].image = new Image();
    this.robot[servoCanvasId].image.src = image;
    this.robot[servoCanvasId].state = state;
    this.robot[servoCanvasId].backgroundColor = '#206499';

    console.log(this.robot[servoCanvasId]);
    $('#sim_container').append("<div id='sim_servo"+id+"' class='sim_element sim_element_servo draggable'><div>"+MSG.simulator['servo']+" "+id+"</div></div>");
    $('#sim_servo' + id).css('top', offsetTop + 'px');
    $('#sim_servo' + id).css('left', offsetLeft + 'px');
    $('#sim_servo' + id).append("<canvas id='" + servoCanvasId + "' class='" + classes + "'></canvas>");
    this.initializeCanvas(servoCanvasId);
    if(draw){
      $('#sim_servo' + id).css('visibility', 'visible');
    } else {
      $('#sim_servo' + id).css('visibility', 'hidden');
    }

    this.scenarioUtils.contextMenuServo();
 };

 /**
  * Remove the most recent created servo from the simulation container.
  */
DwenguinoSimulationScenarioSocialRobot.prototype.removeServo = function(){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("removeRobotComponent", TypesEnum.SERVO));

  var id = this.robot.numberOf[TypesEnum.SERVO];
  $("#sim_servo"+ id + "").remove();

  delete this.robot['sim_servo_canvas' + id];
  this.robot.numberOf[TypesEnum.SERVO] -= 1;
  this.drawSimulationDisplay();
};

/**
 * Add a new LED to the simulation container.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.addLed = function(draw = true, offsetLeft = 5, offsetTop = 5, onColor = 'yellow'){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("addRobotComponent", TypesEnum.LED));
  this.robot.numberOf[TypesEnum.LED] += 1;
  var i = this.robot.numberOf[TypesEnum.LED];
  var id = this.getLedId(i);
  var ledCanvasId = 'sim_led_canvas' + i;

  this.robot[ledCanvasId] = {};
  this.robot[ledCanvasId].radius = 10;
  this.robot[ledCanvasId].x = 0;
  this.robot[ledCanvasId].y = 0;
  this.robot[ledCanvasId].offset = {'left': offsetLeft, 'top': offsetTop};
  this.robot[ledCanvasId].onColor = onColor;
  this.robot[ledCanvasId].offColor = 'gray';
  this.robot[ledCanvasId].borderColor = 'black';
  this.robot[ledCanvasId].state = 0;

  $('#sim_container').append("<div id='sim_led"+i+"' class='sim_element sim_element_led draggable'>"+MSG.simulator['led']+" "+id+"</div>");
  $('#sim_led' + i).css('top', offsetTop + 'px');
  $('#sim_led' + i).css('left', offsetLeft + 'px');
  $('#sim_led' + i).append("<canvas id='" +ledCanvasId+"' class='sim_canvas led_canvas'></canvas>");
  this.initializeCanvas(ledCanvasId);
  if(draw){
    $('#sim_led' + id).css('visibility', 'visible');
  } else {
    $('#sim_led' + id).css('visibility', 'hidden');
  }

  this.scenarioUtils.contextMenuLed();
};

/**
 * Remove the most recent created LED from the simulation container.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.removeLed = function(){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("removeRobotComponent", TypesEnum.LED));
  var id = this.robot.numberOf[TypesEnum.LED];
  $("#sim_led"+ id + "").remove();

  delete this.robot['sim_led_canvas' + id];
  this.robot.numberOf[TypesEnum.LED] -= 1;
};

/**
 * Add a new PIR sensor to the simulation container.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.addPir = function(draw = true, offsetLeft = 5, offsetTop = 5){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("addRobotComponent", TypesEnum.PIR));
  this.robot.numberOf[TypesEnum.PIR] += 1;
  var id = this.robot.numberOf[TypesEnum.PIR];
  var pirCanvasId = 'sim_pir_canvas' + id;

  this.robot[pirCanvasId] = {};
  this.robot[pirCanvasId].width = 50;
  this.robot[pirCanvasId].height = 50;
  this.robot[pirCanvasId].offset = {'left': offsetLeft, 'top': offsetTop};
  this.robot[pirCanvasId].image = new Image();
  this.robot[pirCanvasId].image.src = this.robot.imgPir;
  this.robot[pirCanvasId].state = 0;

  $('#sim_container').append("<div id='sim_pir"+id+"' class='sim_element sim_element_pir draggable'>"+MSG.simulator['pir']+" "+id+"</div>");
  $('#sim_pir' + id).css('top', offsetTop + 'px');
  $('#sim_pir' + id).css('left', offsetLeft + 'px');
  var pirButtonId = 'sim_pir_button' + id;
  $('#sim_pir' + id).append("<canvas id='sim_pir_canvas" +id+"' class='sim_canvas pir_canvas'></canvas>"); 
  $('#sim_pir' + id).append('<div id="' + pirButtonId + '" class="pir_button"></div>');
  this.addPirEventHandler(pirButtonId, pirCanvasId);
  this.initializeCanvas(pirCanvasId);
  if(draw){
    $('#sim_pir' + id).css('visibility', 'visible');
  } else {
    $('#sim_pir' + id).css('visibility', 'hidden');
  }
};

/**
 * Remove the most recent created PIR sensor from the simulation container.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.removePir = function(){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("removeRobotComponent", TypesEnum.PIR));
  var id = this.robot.numberOf[TypesEnum.PIR];
  $('#sim_pir'+ id).remove();

  delete this.robot['sim_pir_canvas' + id];
  this.robot.numberOf[TypesEnum.PIR] -= 1;
};

/**
 * Add a new SONAR sensor to the simulation container.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.addSonar = function(draw = true, offsetLeft = 5, offsetTop = 5){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("addRobotComponent", TypesEnum.SONAR));
  this.robot.numberOf[TypesEnum.SONAR] += 1;
  var id = this.robot.numberOf[TypesEnum.SONAR];
  var sonarCanvasId = 'sim_sonar_canvas' + id;

  this.robot[sonarCanvasId] = {};
  this.robot[sonarCanvasId].width = 100;
  this.robot[sonarCanvasId].height = 58;
  this.robot[sonarCanvasId].offset = {'left': offsetLeft, 'top': offsetTop};
  this.robot[sonarCanvasId].image = new Image();
  this.robot[sonarCanvasId].image.src = this.robot.imgSonar;

  $('#sim_container').append("<div id='sim_sonar"+id+"' class='sim_element sim_element_sonar draggable'>"+MSG.simulator['sonar']+" "+id+"</div>");
  $('#sim_sonar' + id).css('top', offsetTop + 'px');
  $('#sim_sonar' + id).css('left', offsetLeft + 'px');
  var pirButtonId = 'sim_sonar_button' + id;
  $('#sim_sonar' + id).append("<canvas id='sim_sonar_canvas" +id+"' class='sim_canvas sonar_canvas'></canvas>"); 
  // $('#sim_sonar' + id).append('<div id="' + sonarButtonId + '" class="sonar_button"></div>');
  // this.addPirEventHandler(pirButtonId, pirCanvasId);
  this.initializeCanvas(sonarCanvasId);
  if(draw){
    $('#sim_sonar' + id).css('visibility', 'visible');
  } else {
    $('#sim_sonar' + id).css('visibility', 'hidden');
  }
};

/**
 * Remove the most recent created SONAR sensor from the simulation container.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.removeSonar = function(){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("removeRobotComponent", TypesEnum.SONAR));
  var id = this.robot.numberOf[TypesEnum.SONAR];
  $('#sim_sonar'+ id).remove();

  delete this.robot['sim_sonar_canvas' + id];
  this.robot.numberOf[TypesEnum.SONAR] -= 1;
};


 /**
  * Add a new decoration component to the simulation container.
  */
 DwenguinoSimulationScenarioSocialRobot.prototype.addDecoration = function(draw = true, offsetLeft = 5, offsetTop = 5, state = 'hair'){
  this.robot.numberOf[TypesEnum.DECORATION] += 1;
  var id = this.robot.numberOf[TypesEnum.DECORATION];
  var decorationCanvasId = 'sim_decoration_canvas' + id;

  this.robot[decorationCanvasId] = {};
  this.robot[decorationCanvasId].width = 100;
  this.robot[decorationCanvasId].height = 50;
  this.robot[decorationCanvasId].x = 0;
  this.robot[decorationCanvasId].y = 0;
  this.robot[decorationCanvasId].offset = {'left': offsetLeft, 'top': offsetTop};
  this.robot[decorationCanvasId].state = state;

  $('#sim_container').append("<div id='sim_decoration"+id+"' class='sim_element sim_element_decoration draggable'>Decoration</div>");
  $('#sim_decoration' + id).css('top', offsetTop + 'px');
  $('#sim_decoration' + id).css('left', offsetLeft + 'px');
  $('#sim_decoration' + id).append("<canvas id='" + decorationCanvasId + "' class='sim_canvas decoration_canvas'></canvas>");
  this.initializeCanvas(decorationCanvasId);
  if(draw){
    $('#sim_decoration' + id).css('visibility', 'visible');
  } else {
    $('#sim_decoration' + id).css('visibility', 'hidden');
  }
};

/**
* Remove the most recent created decoration element from the simulation container.
*/
DwenguinoSimulationScenarioSocialRobot.prototype.removeDecoration = function(){
  var id = this.robot.numberOf[TypesEnum.DECORATION];
  $("#sim_decoration"+ id + "").remove();

  delete this.robot['sim_decoration_canvas' + id];
  this.robot.numberOf[TypesEnum.DECORATION] -= 1;
  this.drawSimulationDisplay();
};

 /**
  * Add a new decoration component to the simulation container.
  */
 DwenguinoSimulationScenarioSocialRobot.prototype.addLcd = function(draw = true, offsetLeft = 5, offsetTop = 5){
  this.robot.numberOf[TypesEnum.LCD] += 1;
  var id = this.robot.numberOf[TypesEnum.LCD];

  var decorationCanvasId = 'sim_lcd_canvas' + id;

  this.robot[decorationCanvasId] = {};
  this.robot[decorationCanvasId].offset = {'left': offsetLeft, 'top': offsetTop};

  $('#sim_container').append("<div id='sim_lcd"+id+"' class='sim_element sim_element_lcd draggable'>Lcd</div>");
  $('#sim_lcd' + id).css('top', offsetTop + 'px');
  $('#sim_lcd' + id).css('left', offsetLeft + 'px');
  $('#sim_lcd' + id).append("<div id='sim_element_lcd_img'></div>");
  $('#sim_element_lcd_img').append('<div class="lcd" id="sim_lcd_row0"></div>');
  $('#sim_element_lcd_img').append('<div class="lcd" id="sim_lcd_row1"></div>');
  // $('#sim_decoration' + id).append("<canvas id='" + decorationCanvasId + "' class='sim_canvas decoration_canvas'></canvas>");
  this.initializeCanvas(decorationCanvasId);
  if(draw){
    $('#sim_lcd' + id).css('visibility', 'visible');
  } else {
    $('#sim_lcd' + id).css('visibility', 'hidden');
  }
};

/**
* Remove the most recent created decoration element from the simulation container.
*/
DwenguinoSimulationScenarioSocialRobot.prototype.removeLcd = function(){
  var id = this.robot.numberOf[TypesEnum.LCD];
  $("#sim_lcd"+ id + "").remove();

  delete this.robot['sim_lcd_canvas' + id];
  this.robot.numberOf[TypesEnum.LCD] -= 1;
  this.drawSimulationDisplay();
};



/**
 * Initialized the canvas with the given id (string) to the right dimensions and subsequently updates the simulation
 */
DwenguinoSimulationScenarioSocialRobot.prototype.initializeCanvas = function(canvasId){
  var canvas = document.getElementById(canvasId);
  if(canvas !== null){
    this.drawSimulation.configureCanvasDimensions(canvas);
    this.drawSimulationDisplay();
  }
}

/**
 * Returns the led id of the Dwenguino board based on the id of the canvas.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.getLedId = function(i){
  var id = 0;
  if(i < 9){
    id = i-1;
  } else {
    id = 13;
  }
  return id;
}

/**
 * Changes the color of led canvas i to the given color.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.setLedColor = function(i, color){
  var ledCanvasId = 'sim_led_canvas' + i;
  this.robot[ledCanvasId].onColor = color;
}

DwenguinoSimulationScenarioSocialRobot.prototype.setServoState = function(i, state){
  var servoCanvasId = 'sim_servo_canvas' + i;
  this.robot[servoCanvasId].state = state;

  switch(state){
    case StatesEnum.PLAIN:
        console.log('plain');
        this.robot[servoCanvasId].image.src = this.robot.imgServo;
        this.robot[servoCanvasId].width = 100;
        this.robot[servoCanvasId].height = 50;
        document.getElementById(servoCanvasId).classList.remove('hand_canvas');
        break;
    case StatesEnum.EYE:
        console.log('eye');
        this.drawSimulation.clearCanvas(servoCanvasId);
        this.robot[servoCanvasId].image.src = this.robot.imgEye;
        this.robot[servoCanvasId].width = 50;
        this.robot[servoCanvasId].height = 50;
        document.getElementById(servoCanvasId).classList.remove('hand_canvas');
        break;
    case StatesEnum.RIGHTHAND:
        console.log('right hand');
        this.drawSimulation.clearCanvas(servoCanvasId);
        this.robot[servoCanvasId].image.src = this.robot.imgRightHand;
        this.robot[servoCanvasId].width = 64;
        this.robot[servoCanvasId].height = 149;
        document.getElementById(servoCanvasId).classList.add('hand_canvas');
        this.initializeCanvas(servoCanvasId);
        this.drawSimulation.drawServo(this.robot, document.getElementById(servoCanvasId));
        break;
    case StatesEnum.LEFTHAND:
        console.log('left hand');
        this.drawSimulation.clearCanvas(servoCanvasId);
        this.robot[servoCanvasId].image.src = this.robot.imgLeftHand;
        this.robot[servoCanvasId].width = 64;
        this.robot[servoCanvasId].height = 149;
        document.getElementById(servoCanvasId).classList.add('hand_canvas');
        this.initializeCanvas(servoCanvasId);
        break;
  }
}

DwenguinoSimulationScenarioSocialRobot.prototype.addPirEventHandler = function(pirButtonId, pirCanvasId){
  var self = this;

  $("#" + pirButtonId).on('mousedown', function() {
    if (document.getElementById(pirButtonId).className === "pir_button") {
      document.getElementById(pirButtonId).className = "pir_button pir_button_pushed";
      self.robot[pirCanvasId].state = 1;
    }
  });

  $("#"+ pirButtonId).on('mouseup', function() {
    if (document.getElementById(pirButtonId).className === "pir_button pir_button_pushed") {
      document.getElementById(pirButtonId).className = "pir_button";
      self.robot[pirCanvasId].state = 0;
    }
  });
}

/**********************
 *  LOCAL STORAGE     *
 **********************/

/**
 * Checks if the scenario was saved in the local storage. If this is the 
 * case, the saved components are loaded into the simulation container.
 * This function will be called when the social robot scenario is added to the list of scenarios.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.checkLocalStorage = function(){
  if (window.localStorage) {
    var localStorage = window.localStorage;

    if(localStorage.getItem('socialRobotScenario')){

      for (const [type, t] of Object.entries(TypesEnum)) {
        var elements = localStorage.getItem(t);
        if(elements != null){
          elements = elements.split('+').map(e => e.split(','));
          for(var i = 0; i < elements.length-1; i++){
            switch(t) {
              case TypesEnum.SERVO:
                this.addServo(false,elements[i][2], elements[i][3], elements[i][4], parseFloat(elements[i][5]), parseFloat(elements[i][6]), elements[i][7], elements[i][8]);
                break;
              case TypesEnum.LED:
                this.addLed(false,elements[i][2], elements[i][3], elements[i][4]);
                break;
              case TypesEnum.PIR:
                this.addPir(false,elements[i][2], elements[i][3]);
                break;
              case TypesEnum.SONAR:
                this.addSonar(false, elements[i][2], elements[i][3]);
                break;
              case TypesEnum.LCD:
                this.addLcd(false, elements[i][2], elements[i][3]);
                break;
            }
            DwenguinoSimulationRobotComponentsMenu.changeValue(t,1); 
          }
        }
      }
    }
  }
}

/**
 * Displays the robot components that were instantiated from the local storage. 
 * Additionally it triggers saveRobotComponents to periodically save the current scenario
 * state in the local storage.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.loadRobotComponents = function(){
  if (window.localStorage) {
    var localStorage = window.localStorage;
    var self = this;

    if(localStorage.getItem('socialRobotScenario')){
      for (const [type, t] of Object.entries(TypesEnum)) {
        for(var i = 1; i <= self.robot.numberOf[t]; i++){
          $('#sim_' + t + i ).css('visibility', 'visible');
        }
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

    try {

      // Set the interval and autosave every second
      setInterval(function() {
        localStorage.setItem('socialRobotScenario', 'saved');
        for (const [type, t] of Object.entries(TypesEnum)) {
          var saveState = '';
          
          for(var i = 1; i <= self.robot.numberOf[t]; i++){
            var simId = '#sim_' + t + i;
            var canvasId = 'sim_' + t + '_canvas' + i;
            var leftOffset = 0;
            if($(simId).attr('data-x')){
              leftOffset = parseFloat(self.robot[canvasId].offset['left']) + parseFloat($(simId).attr('data-x'));
            } else {
              leftOffset = parseFloat(self.robot[canvasId].offset['left']);
            }

            var topOffset = 0;
            if($(simId).attr('data-y')){
              topOffset = parseFloat(self.robot[canvasId].offset['top']) + parseFloat($(simId).attr('data-y'));
            } else {
              topOffset = parseFloat(self.robot[canvasId].offset['top']);
            }

            if(t === TypesEnum.LED){
              var onColor = self.robot[canvasId].onColor;
              saveState = saveState.concat("sim_" + t,i,",", "sim_"+ t + "_canvas",i,",",leftOffset,",",topOffset,",",onColor, "+");  
            } else if(t === TypesEnum.SERVO) {
              var width = parseFloat(self.robot[canvasId].width);
              var height = parseFloat(self.robot[canvasId].height);
              var image = self.robot[canvasId].image.src;
              var state = self.robot[canvasId].state;
              var classes = document.getElementById(canvasId).className;
              saveState = saveState.concat("sim_" + t,i,",", "sim_"+ t + "_canvas",i,",",leftOffset,",",topOffset, ",", state, ",", width, ",", height, ",", image, ",", classes, "+");
            } else {
              saveState = saveState.concat("sim_" + t,i,",", "sim_"+ t + "_canvas",i,",",leftOffset,",",topOffset, "+");
            }         
          }
          localStorage.setItem(t, saveState);
        }
      }, 1000);

    } catch (e) {

      if (e == QUOTA_EXCEEDED_ERR) {
        alert('Quota exceeded!');
      }
    }

  } else {
    console.log("No local storage");
  }
}

/*********************
 *  XML HANDLING     *
 ********************/

/**
 * Writes the current scenario state to an Xml document and return it.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.loadToXml = function(){
  var data = '<xml xmlns="http://www.w3.org/1999/xhtml">';
  if (window.localStorage) {
    var localStorage = window.localStorage;
    var canvasId = '';
    if(localStorage.getItem('socialRobotScenario')){

      for (const [type, t] of Object.entries(TypesEnum)) {
        var elements = localStorage.getItem(t);
        elements = elements.split('+').map(e => e.split(','));
        for(var i = 0; i < elements.length-1; i++){
          canvasId = elements[i][1];
          data = data.concat("<Item ");
          data = data.concat(" Type='", t, "'");
          data = data.concat(" Id='",elements[i][0], "'");
          data = data.concat(" CanvasId='",elements[i][1], "'");
          data = data.concat(" OffsetLeft='",elements[i][2], "'");
          data = data.concat(" OffsetTop='",elements[i][3], "'");
          if(t === TypesEnum.SERVO){
            data = data.concat(" State='", elements[i][4], "'");
            data = data.concat(" Width='", elements[i][5], "'");
            data = data.concat(" Height='", elements[i][6], "'"); 
            data = data.concat(" Image='", elements[i][7], "'");
            data = data.concat(" Classes='", elements[i][8], "'");
          }
          if(t === TypesEnum.LED){
            data = data.concat(" OnColor='",elements[i][4], "'");
          }
          data = data.concat('></Item>');
        }
      }
    }
  }
  data = data.concat('</xml>');
  return data;
}

/**
 * Loads the current xml document and adds the specified robot components
 * to the simulation container. It immediately displays the components on the screen.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.loadFromXml = function(){
  this.initSocialRobot();
  var container = document.getElementById("sim_container");
  var elements = container.getElementsByClassName("sim_element");
  DwenguinoSimulationRobotComponentsMenu.resetButtons();

  while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
  }

  $('#sim_container').append("<div id='sim_background' class='sim_element draggable'></div>");
  $('#sim_background').css('top', 0 + 'px');
  $('#sim_background').css('left', 0 + 'px');
  $('#sim_background').css('background-image', this.robot.imgRobot);

  var data = this.scenarioUtils.textToDom(this.xml);

  var childCount = data.childNodes.length;
  for (var i = 0; i < childCount; i++) {
    var xmlChild = data.childNodes[i];
    var type = xmlChild.getAttribute('Type');
    var offsetLeft = parseFloat(xmlChild.getAttribute('OffsetLeft'));
    var offsetTop = parseFloat(xmlChild.getAttribute('OffsetTop'));

    switch(type) {
      case TypesEnum.SERVO:
        var width = parseFloat(xmlChild.getAttribute('Width'));
        var height = parseFloat(xmlChild.getAttribute('Height'));
        var image = xmlChild.getAttribute('Image');
        var state = xmlChild.getAttribute('State');
        console.log(state);
        var classes = xmlChild.getAttribute('Classes');
        this.addServo(true,offsetLeft, offsetTop, state, width, height, image, classes);
        break;
      case TypesEnum.LED:
        var onColor = xmlChild.getAttribute('OnColor');
        this.addLed(true,offsetLeft, offsetTop, onColor);
        break;
      case TypesEnum.PIR:
        this.addPir(true,offsetLeft, offsetTop);
        break;
      case TypesEnum.SONAR:
        this.addSonar(true, offsetLeft, offsetTop);
        break;
    }
    DwenguinoSimulationRobotComponentsMenu.changeValue(type,1);
  }
}