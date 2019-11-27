/**
 * Implementation of this tour with Tour.js
 */

// tutorials.introductionSocialRobot = {
//     targets: [
//         '#' + tutorialTargets.dwenguino,
//         '#' + tutorialTargets.simulatorButton,
//         '#' + tutorialTargets.simulatorScenarioSocialRobot,
//         '#' + tutorialTargets.robotComponentsMenuLedPlusButton,
//         '#' + tutorialTargets.simulatorBottomPane,
//         '#' + tutorialTargets.robotcomponentsMenuLedOptions,
//         '#' + tutorialTargets.toolboxArea,
//         '#' + tutorialTargets.workspaceArea,
//         '#' + tutorialTargets.body
//     ],
//     placements: ["left", "left", "left", "left", "left", "left", "right", "right", "bottom"],
//     nrOfSteps: 9,
//     xOffsets: [0],
//     yOffsets: [0],
//     steps: [],
//     id: "introductionSocialRobot",
//     label: 'Introductie sociale robot',
//     // Create the steps array dynamically by using the different arrays
//     initSteps: function(){
//         for(var i = 0; i < this.nrOfSteps; i++){
//           this.steps[i] = {
//             element: this.targets[i],
//             title: MSG.tutorials.socialrobot['introduction'].stepTitles[i],
//             description: MSG.tutorials.socialrobot['introduction'].stepContents[i],
//             position: this.placements[i]
//           };
//         }
//         const tour = new Tour({
//             padding: 0,
//             nextText: 'Next',
//             doneText: 'Done',
//             prevText: 'Less',
//             tipClasses: 'tip-class active',
//             steps: this.steps
//           });

//           //DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="ndSZof?3RjcH}j2Lp/XZ" x="-312" y="822"><statement name="SETUP"><block type="dwenguino_set_led" id="JRP=z*2cxmd77C1]%2_j"><value name="LED"><block type="dwenguino_led_pins" id="`6(1#3#Z#$M@Xbq?1Xfd"><field name="LED_NUMBER">3</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="@5tkt/z/jAQ:%,nb:Bb-"><field name="LED_ON_OFF">ON</field></block></value><next><block type="dwenguino_delay" id="UY`BuwYMQ$Q@W/RBx4W6"><value name="DELAY_TIME"><block type="char_type" id="mj5fa8/DHdN^R`GxC1?-"><field name="BITMASK">500</field></block></value><next><block type="dwenguino_set_led" id=";^M:Bzu.h.,8-bH|((6J"><value name="LED"><block type="dwenguino_led_pins" id="4fPa^^](u@WY76EvFzq3"><field name="LED_NUMBER">3</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="Vb]-SSu`gi!r(Jcf[GAP"><field name="LED_ON_OFF">OFF</field></block></value><next><block type="dwenguino_delay" id="b{y].+kK+[2Im*dxbNbG"><value name="DELAY_TIME"><block type="char_type" id="30LY_FvNethd98Kevj|b"><field name="BITMASK">500</field></block></value></block></next></block></next></block></next></block></statement></block></xml>');
//           tour.start();
//     },
// };


/**
 * Implementation of this tour with Hopscotch
 */

tutorials.introductionSocialRobot = {
    targets: [
      tutorialTargets.dwenguino,
      tutorialTargets.simulatorButton,
      tutorialTargets.simulatorScenarioSocialRobot,
      tutorialTargets.robotComponentsMenuLedPlusButton,
      tutorialTargets.simulatorBottomPane,
      tutorialTargets.robotComponentsMenuLedMinusButton,
      tutorialTargets.toolboxArea,
      tutorialTargets.workspaceArea,
      document.body
    ],
    placements: [
      "left", 
      "left", 
      "left", 
      "left", 
      "right", 
      "left", 
      "right", 
      "right", 
      "top"
    ],
    nrOfSteps: 9,
    xOffsets: [
      0, 
      0, 
      0, 
      0, 
      -600, 
      0, 
      0, 
      -500, 
      500 
    ],
    yOffsets: [
      0, 
      0, 
      90, 
      -10, 
      100, 
      0, 
      -50, 
      500, 
      500 
    ],
    steps: [],
    // Create the steps array dynamically by using the different arrays
    initSteps: function(){
      var i;
      for (i = 0 ; i < this.nrOfSteps ; i++){
        this.steps.push({
          title: MSG.tutorials.socialrobot['introduction'].stepTitles[i],
          content: MSG.tutorials.socialrobot['introduction'].stepContents[i],
          target: this.targets[i],
          placement: this.placements[i],
          showCloseButton:"true",
          width: 400,
          xOffset: this.xOffsets[i],
          yOffset: this.yOffsets[i],
        });
      }
    },
    id: "introductionSocialRobot",
    label: MSG.tutorials.socialrobot['introduction'].label,
    //label: MSG.tutsLampOnOffWeGoSTEM,
    onStart: function(){
        //Load blocks with xml file
      //DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="ndSZof?3RjcH}j2Lp/XZ" x="-312" y="822"><statement name="SETUP"><block type="dwenguino_set_led" id="JRP=z*2cxmd77C1]%2_j"><value name="LED"><block type="dwenguino_led_pins" id="`6(1#3#Z#$M@Xbq?1Xfd"><field name="LED_NUMBER">3</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="@5tkt/z/jAQ:%,nb:Bb-"><field name="LED_ON_OFF">ON</field></block></value><next><block type="dwenguino_delay" id="UY`BuwYMQ$Q@W/RBx4W6"><value name="DELAY_TIME"><block type="char_type" id="mj5fa8/DHdN^R`GxC1?-"><field name="BITMASK">500</field></block></value><next><block type="dwenguino_set_led" id=";^M:Bzu.h.,8-bH|((6J"><value name="LED"><block type="dwenguino_led_pins" id="4fPa^^](u@WY76EvFzq3"><field name="LED_NUMBER">3</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="Vb]-SSu`gi!r(Jcf[GAP"><field name="LED_ON_OFF">OFF</field></block></value><next><block type="dwenguino_delay" id="b{y].+kK+[2Im*dxbNbG"><value name="DELAY_TIME"><block type="char_type" id="30LY_FvNethd98Kevj|b"><field name="BITMASK">500</field></block></value></block></next></block></next></block></next></block></statement></block></xml>');
    },
    onEnd: function(){
        DwenguinoBlockly.endTutorial();
    },
    onNext: function(){
      DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("tutorialNextStep", DwenguinoBlockly.tutorialIdSetting));
      console.log(DwenguinoBlockly.createEvent("tutorialNextStep", DwenguinoBlockly.tutorialIdSetting));
    },
    onPrev: function(){
      DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("tutorialPrevStep", DwenguinoBlockly.tutorialIdSetting));
      console.log(DwenguinoBlockly.createEvent("tutorialPrevStep", DwenguinoBlockly.tutorialIdSetting));
    },

    onShow: function(){

      // Hide arrow on the last step
      var curr = hopscotch.getCurrStepNum();
      if(curr == 8){
        $('.hopscotch-bubble-arrow-container').css('visibility', 'hidden');
      }
    }
};