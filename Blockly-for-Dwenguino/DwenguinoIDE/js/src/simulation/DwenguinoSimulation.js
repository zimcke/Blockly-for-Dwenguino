import SimulationControlsController from "./SimulationControlsController.js";
import DwenguinoSimulationScenarioSocialRobot from "../scenario/socialrobot/DwenguinoSimulationScenarioSocialRobot.js";
import DwenguinoSimulationScenarioRidingRobot from "../scenario/ridingrobot/DwenguinoSimulationScenarioRidingRobot.js";
import DwenguinoSimulationScenarioRidingRobotWithWall from "../scenario/ridingrobot/DwenguinoSimulationScenarioRidingRobotWithWall.js";

export default class DwenguinoSimulation{
    logger = null;
    workspace = null;
    scenarios = null;
    
    constructor(logger, workspace){
        this.scenarios = {
            "moving": new DwenguinoSimulationScenarioRidingRobot(logger),
            "wall": new DwenguinoSimulationScenarioRidingRobotWithWall(logger),
            "socialrobot": new DwenguinoSimulationScenarioSocialRobot(logger),
            //"spyrograph": new DwenguinoSimulationScenarioSpyrograph() /*, "moving", "wall", "spyrograph"*/
        };
        this.logger = logger;
        this.workspace = workspace;
        this.simControlsController = new SimulationControlsController(this.logger, this.workspace, this.scenarios);
        //this.open();
        
    }

    open(){
        // Do nothing for now, once crated always created
    }
    stop(){
        this.simControlsController.handleSimulationStop();
    }
}