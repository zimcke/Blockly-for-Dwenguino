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

    $('#sim_container').css('background-image', this.robot.imgRobot);
    $('#sim_container').css('background-size', '100% 100%');

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

    var scenarioOptions = $("<div>").attr("id", "scenario_options");
    $('#sim_container').append(scenarioOptions);
    scenarioOptions.append("<div id='save_scenario'>Save</div>");
    scenarioOptions.append("<div id='load_scenario'>Load</div>");

    $("#save_scenario").click(function(){
      var data = self.getScenarioData();
      self.scenarioUtils.saveScenario(data);
    });

    $("#load_scenario").click(function(){
      self.scenarioUtils.loadScenario();
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
      imgRobot: 'url("./img/socialrobot/robot1.svg")',
    };
 };

 /**
  * Resets the robot components of the simulation container to their initial state. This function doesn't
  * remove the components from the container or move them around, but merely puts them in their initial off state.
  */
 DwenguinoSimulationScenarioSocialRobot.prototype.resetSocialRobot = function(containerIdSelector){
    for(var i = 1; i <= this.robot.numberOfServos; i++){
      var servoCanvasId = 'sim_servo_canvas' + i;
      this.robot[servoCanvasId].x = 0;
      this.robot[servoCanvasId].y = 0;
      this.robot[servoCanvasId].angle = 0;
      this.robot[servoCanvasId].prevAngle = 0;
    }

    for(var i = 1; i <= this.robot.numberOfLeds; i++){
      var ledCanvasId = 'sim_led_canvas' + i;
      this.robot[ledCanvasId].x = 0;
      this.robot[ledCanvasId].y = 0;
      this.robot[ledCanvasId].state = 0;
    }

    for(var i = 1; i <= this.robot.numberOfPirs; i++){
      var pirCanvasId = 'sim_pir_canvas' + i;
      this.robot[pirCanvasId].state = 0;
    }
 }

 /**
  * Add a new servo to the simulation container.
  */
 DwenguinoSimulationScenarioSocialRobot.prototype.addServo = function(draw = true, offsetLeft = 5, offsetTop = 5){
    this.robot.numberOfServos += 1;
    var id = this.robot.numberOfServos;
    var servoCanvasId = 'sim_servo_canvas' + id;

    this.robot[servoCanvasId] = {};
    this.robot[servoCanvasId].width = 100;
    this.robot[servoCanvasId].height = 50;
    this.robot[servoCanvasId].x = 0;
    this.robot[servoCanvasId].y = 0;
    this.robot[servoCanvasId].offsetLeft = offsetLeft;
    this.robot[servoCanvasId].offsetTop = offsetTop;
    this.robot[servoCanvasId].angle = 0;
    this.robot[servoCanvasId].prevAngle = 0;
    this.robot[servoCanvasId].image = new Image();
    this.robot[servoCanvasId].image.src = this.robot.imgServo;
    this.robot[servoCanvasId].backgroundcolor = '#206499';

    $('#sim_container').append("<div id='sim_servo"+id+"' class='sim_element sim_element_servo draggable'>"+MSG.simulator['servo']+" "+id+"</div>");
    $('#sim_servo' + id).css('top', offsetTop + 'px');
    $('#sim_servo' + id).css('left', offsetLeft + 'px');
    $('#sim_servo' + id).append("<canvas id='" + servoCanvasId + "' class='sim_canvas servo_canvas'></canvas>");
    this.initializeCanvas(servoCanvasId);
    if(draw){
      $('#sim_servo' + id).css('visibility', 'visible');
    } else {
      $('#sim_servo' + id).css('visibility', 'hidden');
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
DwenguinoSimulationScenarioSocialRobot.prototype.addLed = function(draw = true, offsetLeft = 5, offsetTop = 5){
  this.robot.numberOfLeds += 1;
  var i = this.robot.numberOfLeds;
  var id = this.getLedId(i);
  var ledCanvasId = 'sim_led_canvas' + i;

  this.robot[ledCanvasId] = {};
  this.robot[ledCanvasId].radius = 10;
  this.robot[ledCanvasId].x = 0;
  this.robot[ledCanvasId].y = 0;
  this.robot[ledCanvasId].offsetLeft = offsetLeft;
  this.robot[ledCanvasId].offsetTop = offsetTop;
  this.robot[ledCanvasId].oncolor = 'yellow';
  this.robot[ledCanvasId].offcolor = 'gray';
  this.robot[ledCanvasId].bordercolor = 'black';
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
DwenguinoSimulationScenarioSocialRobot.prototype.addPir = function(draw = true, offsetLeft = 5, offsetTop = 5){
  this.robot.numberOfPirs += 1;
  var id = this.robot.numberOfPirs;
  var pirCanvasId = 'sim_pir_canvas' + id;

  this.robot[pirCanvasId] = {};
  this.robot[pirCanvasId].width = 50;
  this.robot[pirCanvasId].height = 50;
  this.robot[pirCanvasId].offsetLeft = offsetLeft;
  this.robot[pirCanvasId].offsetTop = offsetTop;
  this.robot[pirCanvasId].image = new Image();
  this.robot[pirCanvasId].image.src = this.robot.imgPir;
  this.robot[pirCanvasId].state = 0;

  $('#sim_container').append("<div id='sim_pir"+id+"' class='sim_element sim_element_pir draggable'>"+MSG.simulator['pir']+" "+id+"</div>");
  $('#sim_pir' + id).css('top', offsetTop + 'px');
  $('#sim_pir' + id).css('left', offsetLeft + 'px');
  $('#sim_pir' + id).append("<canvas id='sim_pir_canvas" +id+"' class='sim_canvas pir_canvas'></canvas>"); 
  this.addPirEventHandler(pirCanvasId);
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
  var id = this.robot.numberOfPirs;
  $('#sim_pir'+ id).remove();

  delete this.robot['sim_pir_canvas' + id];
  this.robot.numberOfPirs -= 1;
};

DwenguinoSimulationScenarioSocialRobot.prototype.checkLocalStorage = function(){
  if (window.localStorage) {
    var localStorage = window.localStorage;

    if(localStorage.getItem('socialRobotScenario')){
      var types = ['servos','leds','pirs'];

      for (const t of types) {
        var elements = localStorage.getItem(t);
        elements = elements.split('+').map(e => e.split(','));
        for(var i = 0; i < elements.length-1; i++){
          switch(t) {
            case 'servos':
              this.addServo(false,elements[i][2], elements[i][3]);
              DwenguinoSimulationRobotComponentsMenu.changeValue(t,1);
              break;
            case 'leds':
              this.addLed(false,elements[i][2], elements[i][3]);
              DwenguinoSimulationRobotComponentsMenu.changeValue(t,1);
              break;
            case 'pirs':
              this.addPir(false,elements[i][2], elements[i][3]);
              DwenguinoSimulationRobotComponentsMenu.changeValue(t,1);
              break;
          }
        }
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
        $('#sim_servo' + i ).css('visibility', 'visible');
      }

      for(var i = 1; i <= self.robot.numberOfLeds; i++){
        $('#sim_led' + i ).css('visibility', 'visible');
      }

      for(var i = 1; i <= self.robot.numberOfPirs; i++){
        $('#sim_pir' + i ).css('visibility', 'visible');
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

        var leds = '';
        for(var i = 1; i <= self.robot.numberOfLeds; i++){
          var leftOffset = 0;
          if($('#sim_led' + i).attr('data-x')){
            leftOffset = parseFloat(self.robot['sim_led_canvas' + i].offsetLeft) + parseFloat($('#sim_led' + i).attr('data-x'));
          } else {
            leftOffset = parseFloat(self.robot['sim_led_canvas' + i].offsetLeft);
          }

          var topOffset = 0;
          if($('#sim_led' + i).attr('data-x')){
            topOffset = parseFloat(self.robot['sim_led_canvas' + i].offsetTop) + parseFloat($('#sim_led' + i).attr('data-y'));
          } else {
            topOffset = parseFloat(self.robot['sim_led_canvas' + i].offsetTop);
          }

          leds = leds.concat("sim_led",i,",", "sim_led_canvas",i,",",leftOffset,",",topOffset, "+");  
        }

        var pirs = '';
        for(var i = 1; i <= self.robot.numberOfPirs; i++){
          var leftOffset = 0;
          if($('#sim_pir' + i).attr('data-x')){
            leftOffset = parseFloat(self.robot['sim_pir_canvas' + i].offsetLeft) + parseFloat($('#sim_pir' + i).attr('data-x'));
          } else {
            leftOffset = parseFloat(self.robot['sim_pir_canvas' + i].offsetLeft);
          }

          var topOffset = 0;
          if($('#sim_pir' + i).attr('data-x')){
            topOffset = parseFloat(self.robot['sim_pir_canvas' + i].offsetTop) + parseFloat($('#sim_pir' + i).attr('data-y'));
          } else {
            topOffset = parseFloat(self.robot['sim_pir_canvas' + i].offsetTop);
          }

          pirs = pirs.concat("sim_pir",i,",", "sim_pir_canvas",i,",",leftOffset,",",topOffset, "+");  
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

/**
 * Initialized the canvas with the given id (string) to the right dimensions and subsequently updates the simulation
 */
DwenguinoSimulationScenarioSocialRobot.prototype.initializeCanvas = function(canvasId){
  var canvas = document.getElementById(canvasId);
  this.drawSimulation.configureCanvasDimensions(canvas);
  this.drawSimulationDisplay();
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

DwenguinoSimulationScenarioSocialRobot.prototype.addPirEventHandler = function(pirCanvasId){
  var self = this;
  // Add PIR event handler here
  $("#rc_pir_button").on('mousedown', function() {
    if (document.getElementById('rc_pir_button').className === "sim_button") {
      document.getElementById('rc_pir_button').className = "sim_button sim_button_pushed";
      self.robot[pirCanvasId].state = 1;
    }
  });

  $("#rc_pir_button").on('mouseup', function() {
    if (document.getElementById('rc_pir_button').className === "sim_button sim_button_pushed") {
      document.getElementById('rc_pir_button').className = "sim_button";
      self.robot[pirCanvasId].state = 0;
    }
  });
}


DwenguinoSimulationScenarioSocialRobot.prototype.getScenarioData = function(){
  var data = '<xml xmlns="http://www.w3.org/1999/xhtml">';
  if (window.localStorage) {
    var localStorage = window.localStorage;

    if(localStorage.getItem('socialRobotScenario')){
      var types = ['servos','leds','pirs'];

      for (const t of types) {
        var elements = localStorage.getItem(t);
        elements = elements.split('+').map(e => e.split(','));
        for(var i = 0; i < elements.length-1; i++){
          data = data.concat("<Item ");
          data = data.concat(" Type='", t, "'");
          data = data.concat(" Id='",elements[i][0], "'");
          data = data.concat(" CanvasId='",elements[i][1], "'");
          data = data.concat(" OffsetLeft='",elements[i][2], "'");
          data = data.concat(" OffsetTop='",elements[i][3], "'>");
          data = data.concat('</Item>');
        }
      }
    }
  }
  data = data.concat('</xml>');
  return data;
}

DwenguinoSimulationScenarioSocialRobot.prototype.loadFromXml = function(){
  this.initSocialRobot();
  var container = document.getElementById("sim_container");
  var elements = container.getElementsByClassName("sim_element");
  DwenguinoSimulationRobotComponentsMenu.resetButtons();

  while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
  }

  var data = this.scenarioUtils.textToDom(this.xml);

  var childCount = data.childNodes.length;

  for (var i = 0; i < childCount; i++) {
    var xmlChild = data.childNodes[i];
    var type = xmlChild.getAttribute('Type');
    var offsetLeft = parseFloat(xmlChild.getAttribute('OffsetLeft'));
    var offsetTop = parseFloat(xmlChild.getAttribute('OffsetTop'));

    switch(type) {
      case 'servos':
        this.addServo(true,offsetLeft, offsetTop);
        DwenguinoSimulationRobotComponentsMenu.changeValue(type,1);
        break;
      case 'leds':
        this.addLed(true,offsetLeft, offsetTop);
        DwenguinoSimulationRobotComponentsMenu.changeValue(type,1);
        break;
      case 'pirs':
        this.addPir(true,offsetLeft, offsetTop);
        DwenguinoSimulationRobotComponentsMenu.changeValue(type,1);
        break;
    }
  }


  console.log(data);

}

