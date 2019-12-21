var myCanvas = document.getElementById("canvas");
var ctx = myCanvas.getContext("2d");

function Circle(x,y,rad,dx,dy,vel){
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.dx = dx;
    this.dy = dy;
    this.radians = 0;
    this.vel = vel;
    this.degree = Math.random() * (50 - 0) + 0;
    this.draw = function(){
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.rad,0,Math.PI * 2,false);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();
    }
    this.update = function(){
      this.radians += this.vel;
      this.x = x + Math.cos(this.radians) * this.degree;
      this.y = y + Math.sin(this.radians) * this.degree;
      this.draw();
    }
}

var arr = [];
var x = myCanvas.width/2;
var y = myCanvas.height/2;
var rad = 5;
var dy = 1;
var dx = 4;
var len = 50
var vel = 0.05;
for(var i=0; i < len; i++){
  var circle = new Circle(x,y,rad,dx,dy,vel);
  arr.push(circle);
}
function animate(){
  requestAnimationFrame(animate);
  ctx.fillStyle = "rgb(0,0,128,0.08)";
  ctx.fillRect(0,0,innerWidth,innerHeight);
  for(var i=0; i < len;i++){
    arr[i].update();
  }
}
animate();
