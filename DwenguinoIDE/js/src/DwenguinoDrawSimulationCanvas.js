function DwenguinoDrawSimulationCanvas(){
}

/**
 * Clear all canvases in the simulator that are part
 * of the "sim_canvas" class.
 */
DwenguinoDrawSimulationCanvas.prototype.clearCanvases = function(){
    // Clear canvases
    var canvases = document.getElementsByClassName("sim_canvas");
    for(var i = 0; i < canvases.length; i++)
    {
        if (canvases.item(i).getContext) {
            var ctx = canvases.item(i).getContext('2d');
            ctx.clearRect(0, 0, canvases.item(i).width, canvases.item(i).height);
        }
    }
}

/***
 * Draw all leds on led canvases with the states specified in robot.
 */
DwenguinoDrawSimulationCanvas.prototype.drawLeds = function(robot){
    var canvases = document.getElementsByClassName('sim_canvas led_canvas');
    for(var i = 0; i < canvases.length; i++)
    {
        this.drawLed(robot,canvases.item(i));
    }
}

/**
 * Draw an led on the given canvas with the state specified in robot.
 */
DwenguinoDrawSimulationCanvas.prototype.drawLed = function(robot, canvas){
    if (canvas.getContext) {
        var id = canvas.id;
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, robot[id].radius, 0, 2 * Math.PI);
        if (robot[id].state === 1) {
            ctx.fillStyle = robot[id].oncolor;
        } else {
            ctx.fillStyle = robot[id].offcolor;
        }
        ctx.fill();
        ctx.fillStyle = robot[id].bordercolor;
        ctx.stroke();
    } else {
        console.log(canvas, "This canvas has no context");
    }    
}

/**
 * Draw all servos on servo canvases with the states and images specified in robot.
 */
DwenguinoDrawSimulationCanvas.prototype.drawServos = function(robot){
    var canvases = document.getElementsByClassName('sim_canvas servo_canvas');
    for(var i = 0; i < canvases.length; i++)
    {
        this.drawServo(robot,canvases.item(i));   
    }
}

/**
 * Draw a servo  on the given canvas with the state and image specified in robot.
 */
DwenguinoDrawSimulationCanvas.prototype.drawServo = function(robot, canvas){
    if (canvas.getContext) {
        var id = canvas.id;

        // in case the image isn't loaded yet.
        var self = this;
        robot[id].image.onload = function() {
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = robot[id].backgroundcolor;
            ctx.fillRect(robot[id].x, robot[id].y, robot[id].width, robot[id].height);
            self.drawRotatedServohead(ctx, robot[id]);
        }

        var ctx = canvas.getContext('2d');
        ctx.fillStyle = robot[id].backgroundcolor;
        ctx.fillRect(robot[id].x, robot[id].y, robot[id].width, robot[id].height);
        self.drawRotatedServohead(ctx, robot[id]);
    } else {
        console.log(canvas, "This canvas has no context");
    }    
}

/**
 * Draw all pir sensors on pir canvases with the image specified in robot.
 */
DwenguinoDrawSimulationCanvas.prototype.drawPirs = function(robot){
    var canvases = document.getElementsByClassName('sim_canvas pir_canvas');
    for(var i = 0; i < canvases.length; i++)
    {
        this.drawPir(robot,canvases.item(i));
    }
}

/**
 * Draw a pir sensor on the given canvas with the image specified in robot.
 */
DwenguinoDrawSimulationCanvas.prototype.drawPir = function(robot, canvas){
    if (canvas.getContext) {
        var id = canvas.id;

        // in case the image isn't loaded yet.
        var self = this;
        robot[id].image.onload = function() {
            var ctx = canvas.getContext('2d');
            ctx.drawImage(robot[id].image,0,0,robot[id].width,robot[id].height); 
        }

        var ctx = canvas.getContext('2d');
        ctx.drawImage(robot[id].image,0,0,robot[id].width,robot[id].height);
    } else {
        console.log(canvas, "This canvas has no context");
    }       
}

/**
 * Draws the servohead of the given servo at the correct angle on the given context
 */
DwenguinoDrawSimulationCanvas.prototype.drawRotatedServohead = function(ctx, servo){
    // make the servo rotate stepwise
    if((servo.angle-servo.prevAngle) != 0){
        if ((servo.angle-servo.prevAngle) > 5) {
            servo.prevAngle = servo.prevAngle + 5;
            ctx.translate(servo.x+servo.width/2,servo.y+servo.height/2);
            ctx.rotate(servo.prevAngle * Math.PI / 180);
            ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
            ctx.rotate(-servo.prevAngle * Math.PI / 180);
            ctx.translate(-servo.x-servo.width/2, -servo.y-servo.height/2); 
        } else {
            servo.prevAngle = servo.prevAngle + (servo.angle-servo.prevAngle);
            ctx.translate(servo.x+servo.width/2,servo.y+servo.height/2);
            ctx.rotate(servo.angle * Math.PI / 180);
            ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
            ctx.rotate(-servo.angle * Math.PI / 180);
            ctx.translate(-servo.x-servo.width/2, -servo.y-servo.height/2); 
        }
    } else {
        ctx.translate(servo.x+servo.width/2,servo.y+servo.height/2);
        ctx.rotate(servo.angle * Math.PI / 180);
        ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
        ctx.rotate(-servo.angle * Math.PI / 180);
        ctx.translate(-servo.x-servo.width/2, -servo.y-servo.height/2); 
    }
}

/**
 * Configure the canvas pixel dimensions to avoid blurry drawings.
 */
DwenguinoDrawSimulationCanvas.prototype.configureCanvasDimensions = function(canvas){

    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    if(canvas.getContext){
      var ctx = canvas.getContext('2d');
      // Scale all drawing operations by the dpr, so you
      // don't have to worry about the difference.
      ctx.scale(dpr, dpr);
    }
};