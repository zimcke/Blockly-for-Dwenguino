
tutorials.driveForward = {
      id: "tutsDriveForward",
      label: MSG.tutsDriveForward,
      onStart: function(){
        DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="yMwUfZQ@p0kW8udJ1vEa" x="-88" y="-382"><statement name="LOOP"><block type="dc_motor" id="}m$#-.GS5+AKD-gI}OY,"><value name="channel"><block type="math_number" id="32"><field name="NUM">1</field></block></value><value name="speed"><block type="math_number" id="37"><field name="NUM">100</field></block></value><next><block type="dc_motor" id="cgSFVxrXN$Sgeiy15T;?"><value name="channel"><block type="math_number" id="oA@j2Jdo#=lH`r:+![%K"><field name="NUM">2</field></block></value><value name="speed"><block type="math_number" id="a[y,hG3rY^+Pk+cjv=8m"><field name="NUM">-100</field></block></value><next><block type="dwenguino_delay" id="to!Bxm`]gQzEi;K`Bx%s"><value name="DELAY_TIME"><block type="char_type" id="FsFIj~`KNGMlcHhp^^gj"><field name="BITMASK">100</field></block></value></block></next></block></next></block></statement></block></xml>');
      },
      steps: [
        {
          title: MSG.tutorials.driveForward.step1Title,
          content: MSG.tutorials.driveForward.step1Content,
          target: tutorialTargets.simulatorButton,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      },
        {
          title: MSG.tutorials.driveForward.step2Title,
          content: MSG.tutorials.driveForward.step2Content,
          target: tutorialTargets.simulatorScenarioTab,
          placement: "left",
          showCloseButton:"true",
          width: 400,
          yOffset: -20,
      },
      {
        title: MSG.tutorials.driveForward.step3Title,
        content: MSG.tutorials.driveForward.step3Content,
        target: tutorialTargets.dwenguino,
        placement: "left",
        showCloseButton:"true",
        width: 400,
    }
    ],
    onEnd: function(){
        DwenguinoBlockly.endTutorial();
    }
    };