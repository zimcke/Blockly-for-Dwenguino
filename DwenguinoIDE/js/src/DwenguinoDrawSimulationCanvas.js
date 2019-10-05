function DwenguinoDrawSimulationCanvas(sim_canvas, ctx){
    this.sim_canvas = sim_canvas;
    this.ctx = ctx;
}

/**
 * Clear the simulation canvas
 */
DwenguinoDrawSimulationCanvas.prototype.clearCanvas = function(){
    this.ctx.clearRect(0, 0, this.sim_canvas.width, this.sim_canvas.height);
}

/**
 * Draws the given servo on the simulation canvas at the correct angle
 */
DwenguinoDrawSimulationCanvas.prototype.drawServo = function(servo){
    this.ctx.fillStyle = servo.backgroundcolor;
    this.ctx.fillRect(servo.position.x, servo.position.y, servo.width, servo.height);
    this.drawRotatedServohead(servo);
};

/**
 * Draws the given led on the simulation canvas
 */
DwenguinoDrawSimulationCanvas.prototype.drawLed = function(led){
    this.ctx.beginPath();
    this.ctx.arc(led.position.x, led.position.y, led.radius, 0, 2 * Math.PI);
    if (led.state === 1) {
        this.ctx.fillStyle = led.oncolor;
    } else {
        this.ctx.fillStyle = led.offcolor;
    }
    this.ctx.fill();
    this.ctx.fillStyle = led.bordercolor;
    this.ctx.stroke();
}

/**
 * Draws the servohead of the given servo at the correct angle on the simulation canvas
 */
DwenguinoDrawSimulationCanvas.prototype.drawRotatedServohead = function(servo){
    // make the servo rotate stepwise
    if ((servo.position.angle-servo.position.prevAngle) > 5) {
        servo.position.prevAngle = servo.position.prevAngle + 5;
        this.ctx.translate(servo.position.x+servo.width/2,servo.position.y+servo.height/2);
        this.ctx.rotate(servo.position.prevAngle * Math.PI / 180);
        this.ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
        this.ctx.rotate(-servo.position.prevAngle * Math.PI / 180);
        this.ctx.translate(-servo.position.x-servo.width/2, -servo.position.y-servo.height/2); 
    } else {
        this.ctx.translate(servo.position.x+servo.width/2,servo.position.y+servo.height/2);
        this.ctx.rotate(servo.position.angle * Math.PI / 180);
        this.ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
        this.ctx.rotate(-servo.position.angle * Math.PI / 180);
        this.ctx.translate(-servo.position.x-servo.width/2, -servo.position.y-servo.height/2); 
    }
    
}
