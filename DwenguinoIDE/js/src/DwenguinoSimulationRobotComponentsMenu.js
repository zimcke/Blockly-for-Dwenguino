var DwenguinoSimulationRobotComponentsMenu = {
  maxNumberOfServos: 5,
  maxNumberOfLeds: 3,
  maxNumberOfPirs: 1,
  maxNumberOfDecorations: 10,
  socialRobotScenario: {},
  numberOfButtons: 3,

  /** 
  * Initializes the robot components menu environment when loading 
  * the social robot scenario.
  */
  setupEnvironment: function(socialRobotScenario, containerIdSelector) {
    this.socialRobotScenario = socialRobotScenario;
    console.log('setupEnvironment');
    /**
     * TODO: implement: if local storage contains robot components adjust the menu to 
     * display the current number of robot components of each type. 
     * // should actually already be handled by the socialrobotscenario which is used here.
     */
    DwenguinoSimulationRobotComponentsMenu.initMenu(socialRobotScenario);
    DwenguinoSimulationRobotComponentsMenu.translateRobotComponents();
    socialRobotScenario.initSimulation(containerIdSelector);
    this.socialRobotScenario.loadRobotComponents();
  },

  /**
   * Initialize the robot components menu 
   * when the scenario is loaded. 
   */
  initMenu: function(socialRobotScenario) {
    $('#robot_components_menu').append('<div id="rc_servo" class="robot_components_item"></div>');
    $('#rc_servo').append('<div id="rc_servo_tag" class="rc_tag"></div>');
    $('#rc_servo').append('<div id="rc_servo_img"></div>');
    $('#rc_servo').append('<div id="rc_servo_options"></div>');

    $('#robot_components_menu').append('<div id="rc_led" class="robot_components_item"></div>');
    $('#rc_led').append('<div id="rc_led_tag" class="rc_tag"></div>');
    $('#rc_led').append('<div id="rc_led_img"></div>');
    $('#rc_led').append('<div id="rc_led_options"></div>');

    $('#robot_components_menu').append('<div id="rc_pir" class="robot_components_item"></div>');
    $('#rc_pir').append('<div id="rc_pir_tag" class="rc_tag"></div>');
    $('#rc_pir').append('<div id="rc_pir_img"></div>');
   // $('#rc_pir').append('<div id="rc_pir_button" class="sim_button"></div>');
    $('#rc_pir').append('<div id="rc_pir_value"></div>');
    $('#rc_pir').append('<div id="rc_pir_options"></div>');

    $('#robot_components_menu').append('<div id="rc_decoration" class="robot_components_item"></div>');
    $('#rc_decoration').append('<div id="rc_decoration_tag" class="rc_tag"></div>');
    $('#rc_decoration').append('<div id="rc_decoration_img"></div>');
    $('#rc_decoration').append('<div id="rc_decoration_options"></div>');

    DwenguinoSimulationRobotComponentsMenu.initButtons(socialRobotScenario);
  },

  /** 
   * Add buttons to the robot components menu to add or remove robot components 
   * in the scenario.
   */
  initButtons: function(socialRobotScenario) {
  
  // TODO: rewrite this in a more readable way
  $('#rc_servo_options').append('<div class="center"><p></p><div class="input-group"><span class="input-group-btn"><button type="button" id="rc_servo_minus_button" class="btn btn-default btn-number" disabled="disabled" data-type="minus" data-field="servos"><span class="glyphicon glyphicon-minus" id="rc_servo_minus_button"></span></button></span><input type="text" name="servos" class="form-control input-number" value="0" min="0" max="' + DwenguinoSimulationRobotComponentsMenu.maxNumberOfServos + '"><span class="input-group-btn"><button type="button" id="rc_servo_plus_button" class="btn btn-default btn-number" data-type="plus" data-field="servos"><span class="glyphicon glyphicon-plus" id="rc_servo_plus_button"></span></button></span></div>');

  $('#rc_led_options').append('<div class="center"><p></p><div class="input-group"><span class="input-group-btn"><button type="button" id="rc_led_minus_button" class="btn btn-default btn-number" disabled="disabled" data-type="minus" data-field="leds"><span class="glyphicon glyphicon-minus" id="rc_led_minus_button"></span></button></span><input type="text" name="leds" class="form-control input-number" value="0" min="0" max="' + DwenguinoSimulationRobotComponentsMenu.maxNumberOfLeds + '"><span class="input-group-btn"><button type="button" id="rc_led_plus_button" class="btn btn-default btn-number" data-type="plus" data-field="leds"><span class="glyphicon glyphicon-plus" id="rc_led_plus_button"></span></button></span></div>');

  $('#rc_pir_options').append('<div class="center"><p></p><div class="input-group"><span class="input-group-btn"><button type="button" id="rc_pir_minus_button" class="btn btn-default btn-number" disable="disabled" data-type="minus" data-field="pirs"><span class="glyphicon glyphicon-minus" id="rc_pir_minus_button"></span></button></span><input type="text" name="pirs" class="form-control input-number" value="0" min="0" max="' + DwenguinoSimulationRobotComponentsMenu.maxNumberOfPirs + '"><span class="input-group-btn"><button type="button" id="rc_pir_plus_button" class="btn btn-default btn-number" data-type="plus" data-field="pirs"><span class="glyphicon glyphicon-plus" id="rc_pir_plus_button"></span></button></span></div>'); 

  $('#rc_decoration_options').append('<div class="center"><p></p><div class="input-group"><span class="input-group-btn"><button type="button" id="rc_decoration_minus_button" class="btn btn-default btn-number" disable="disabled" data-type="minus" data-field="decorations"><span class="glyphicon glyphicon-minus" id="rc_decoration_minus_button"></span></button></span><input type="text" name="decorations" class="form-control input-number" value="0" min="0" max="' + DwenguinoSimulationRobotComponentsMenu.maxNumberOfDecorations + '"><span class="input-group-btn"><button type="button" id="rc_decoration_plus_button" class="btn btn-default btn-number" data-type="plus" data-field="decorations"><span class="glyphicon glyphicon-plus" id="rc_decoration_plus_button"></span></button></span></div>'); 

    // Event handlers
    $('.btn-number').click(function(e){
      e.preventDefault();
      fieldName = $(this).attr('data-field');
      type      = $(this).attr('data-type');
      var input = $("input[name='"+fieldName+"']");
      var currentVal = parseInt(input.val());
      if (!isNaN(currentVal)) {
          if(type == 'minus') {
              if(currentVal > input.attr('min')) {
                  input.val(currentVal - 1).change();
                  DwenguinoSimulationRobotComponentsMenu.removeRobotComponent(e.target.id, socialRobotScenario);
              } 
              if(parseInt(input.val()) == input.attr('min')) {
                  $(this).attr('disabled', true);
              }

          } else if(type == 'plus') {
              if(currentVal < input.attr('max')) {
                  input.val(currentVal + 1).change();
                  DwenguinoSimulationRobotComponentsMenu.addRobotComponent(e.target.id, socialRobotScenario);
              }
              if(parseInt(input.val()) == input.attr('max')) {
                  $(this).attr('disabled', true);
              }
          }
      } else {
          input.val(0);
      }
    });

    $('.input-number').focusin(function(){
        $(this).data('oldValue', $(this).val());
    });

    $('.input-number').change(function() {
        
        minValue =  parseInt($(this).attr('min'));
        maxValue =  parseInt($(this).attr('max'));
        valueCurrent = parseInt($(this).val());
        
        name = $(this).attr('name');
        if(valueCurrent >= minValue) {
            $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
        } else {
            alert('Sorry, the minimum value was reached');
            $(this).val($(this).data('oldValue'));
        }
        if(valueCurrent <= maxValue) {
            $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
        } else {
            alert('Sorry, the maximum value was reached');
            $(this).val($(this).data('oldValue'));
        }
    });

    $(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
              // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
              // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                  // let it happen, don't do anything
                  return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
  },

  resetButtons: function() {
    var types = ['servos', 'leds', 'pirs', 'decorations'];
    for (const t of types) {
      var input = $("input[name='"+ t +"']");
      input.val(0).change();
    }
  },

  changeValue: function(type, number) {
    var input = $("input[name='"+ type +"']");
    var currentVal = parseInt(input.val())
    input.val(currentVal+number).change();
  },

  /**
   * This function translates the text of the robot components menu.
   */
  translateRobotComponents: function() {
    document.getElementById('rc_servo_tag').textContent = MSG.simulator['servo'];
    document.getElementById('rc_led_tag').textContent = MSG.simulator['led'];
    document.getElementById('rc_pir_tag').textContent = MSG.simulator['pir'];
    document.getElementById('rc_decoration_tag').textContent = MSG.simulator['decoration'];
  },

  /*
   * This function adds the specified robot component to the 
   * social robot scenario.
   */
  addRobotComponent: function(id, socialRobotScenario) {
    console.log(id);
    switch (id) {
      case "rc_servo_plus_button":
        socialRobotScenario.addServo();
        break;
      case "rc_led_plus_button":
        socialRobotScenario.addLed();
        break;
      case "rc_pir_plus_button":
        socialRobotScenario.addPir();
        break;
      case "rc_decoration_plus_button":
        socialRobotScenario.addDecoration();
        break;
      case "default":
        break;
    }
  },

  /*
   * This functions removes the last created specified robot component
   * from the social robot scenario.
   */
  removeRobotComponent: function(id, socialRobotScenario) {
    switch (id) {
      case "rc_servo_minus_button":
        socialRobotScenario.removeServo();
        break;
      case "rc_led_minus_button":
        socialRobotScenario.removeLed();
        break;
      case "rc_pir_minus_button":
        socialRobotScenario.removePir();
        break;
      case "rc_decoration_minus_button":
        socialRobotScenario.removeDecoration();
        break;
      case "default":
        break;
    }
  },

};

 