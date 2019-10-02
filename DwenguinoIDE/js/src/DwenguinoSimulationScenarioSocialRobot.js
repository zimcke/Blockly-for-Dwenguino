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
     this.robot = {
       image: {
         width: 50,
         height: 40
       },
       start: {
         x: 100,
         y: 100,
         angle: 0
       },
       position: {
         x: 100,
         y: 100,
         angle: 0
       },
       collision: [{
         type: 'circle',
         radius: 25
       }]
     };
     this.containerWidth = 0;
     this.containerHeight = 0;
  
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
      console.log('myelement has been resized');
      self.containerWidth = simulationContainer.width();
      self.containerHeight = simulationContainer.height();
    });

    //Init the simulation canvas element in which the social robot will be displayed
    var simCanvas = $("<canvas>").attr("id", "sim_canvas");
    

    simulationContainer.append(simCanvas);
    container.empty();
    container.append(simulationContainer);

    // Set new element styles
    $(containerIdSelector).css("position", "relative")

    $("#sim_container")
    .css("position", "relative")
    .css("width", "100%")
    .css("height", "100%")
    .css("box-sizing", "border-box");

    $("#sim_canvas")
    .css("position", "relative")
    .css("width", "100%")
    .css("height", "100%")

    var sim_canvas = document.getElementById('sim_canvas');

    if (sim_canvas.getContext) {
        var ctx = sim_canvas.getContext('2d');
        
        var servo1 = new Image();
        servo1.src = './img/board/servo_movement.png';

        ctx.fillStyle = '#0a3c7a';
        ctx.fillRect(10, 10, 50, 50);
        ctx.drawImage(servo1, 10, 10);
        } else {
            // canvas unsupported
            console.log("The simulation canvas is not supported by your browser")
        }
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
  
 
  };
  