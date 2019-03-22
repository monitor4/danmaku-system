function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
dir = [[-1,0],[0,-1],[1,0],[0,1]]
function dis (x1,y1,x2,y2){
  return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))
}
var time;
$(document).ready(function(){
  var canvas = document.getElementById('canvas')
  canvas.width = 600;
  canvas.height = 650;
  var ctx = canvas.getContext("2d");
  function danmaku(startX,startY,agl,sp,color){
    this.x = startX;
    this.y = startY;
    this.angle = agl;
    this.speed = sp;
    this.state = 0;
    this.bg = color;
    this.draw = function(){
      ctx.beginPath();
      ctx.fillStyle = this.bg;
      ctx.arc(this.x,this.y,4,Math.PI/180*0,Math.PI/180*360,false);
      ctx.fill();
    }
    this.update = function(){
      if (this.state === 1){
        this.x += Math.cos(this.angle) * this.speed ;
        this.y += Math.sin(this.angle) * this.speed ;
        if (this.x < -2 || this.y < -2 || this.x >= canvas.width + 2 || this.y >= canvas.height + 2)
        {
          this.state = -1;
        }
        if (dis(this.x,this.y,self.x,self.y) <= 10){
          console.log(self.count)
          self.count++;
        }
        
      }
      if (this.state !== -1){
        this.draw();
      }
    }
  }
  var keyBorad = [-1,-1,-1,-1];
  var danmakuList = []
  function self(startX,startY){
    this.x = startX;
    this.y = startY;
    this.count = 0;
    this.draw = function(){
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.arc(this.x,this.y,4,Math.PI/180*0,Math.PI/180*360,false);
      ctx.fill();
    }
    this.update = function(){
      for (i=0;i<4;i++){
        if (keyBorad[i] == 0){
          var newX = this.x + dir[i][0] * 2
          var newY = this.y + dir[i][1] * 2
          if (newX < canvas.width && newX >= 0 && newY < canvas.height && newY >= 0){
            this.x=newX
            this.y=newY
          }
        }
      }
      this.draw();
    }
  }
  var self = new self(300,500);
  self.draw();
  document.onkeydown = function(event){
    if (event.keyCode >= 37 && event.keyCode <= 40 ){
      keyBorad[event.keyCode - 37] = 0
    }
  }
  document.onkeyup = function(event){
    if (event.keyCode >= 37 && event.keyCode <= 40 ){
      keyBorad[event.keyCode - 37] = -1
    }
  }
  function animate() {
    //更新前清楚画布
    time++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    requestAnimationFrame(animate);
    //每个圆都调用update()方法
    self.update();
    for (i=0;i<danmakuList.length;i++){
      danmakuList[i].update();
      if (danmakuList[i].state == -1){
        danmakuList.splice(i,1);
        i--;
      }
    }
  }
  var s = false;
  var stageTime = [600]
  $('.anima-start').click(async function(){
    time=0;
    if (!s){
      animate();
      s = true;
    }
    stage1();
    await sleep(12000);
    stage2();

  })
  async function stage1(){
    var drespeed = 0;
    var flag = true;
    var drea = 0;
    var ways = 5;
    var cd = 25;
    while(time < stageTime[0]){
      for (i=0;i<ways;i++){
        let radian = (360 / ways * i + drespeed) * Math.PI / 180;
        var node = new danmaku(300 + Math.cos(radian) * 20,300 + Math.sin(radian) * 20 ,radian,2, "red");
        node.state = 1;
        danmakuList.push(node);
        node.draw();
      }
      await sleep(cd);
      drea +=0.25;
      drespeed = (drespeed + drea) % 360;
    }
  }
  async function stage2(){
    var color = ["red","blue"]
    self.x = 300
    self.y = 325
    var count = 0;
    var r1 = 0;
    var r2 = 250;
    var radian = Math.PI / 2;
    while(count <= 400)
    {
      for (i = 0 ;i <= 1;i++){
        let r = radian + (1 - i) * Math.PI
        let x1 = 300 + Math.cos(r) * Math.sqrt(r2*r2-r1*r1)
        let y1 = 325 + Math.sin(r) * Math.sqrt(r2*r2-r1*r1)
        let x2 = 300 + Math.cos(r - Math.PI / 2) * r1;
        let y2 = 325 + Math.sin(r - Math.PI / 2) * r1;
        let angle;
        if (x2 - x1 > 0){
          angle = Math.atan((y1-y2)/(x1-x2))
        }
        if (x2 - x1 == 0){
          angle = (y2 - y1) / Math.abs(y2 - y1) * Math.PI / 2
        }
        if (x2 - x1 < 0){
          angle = Math.PI + Math.atan((y1-y2)/(x1-x2))
        }
        var node = new danmaku(x1,y1,angle,1,color[i]);
        danmakuList.push(node);
        node.draw();
      }
      r1 += 0.25
      r2 -= 0.25
      radian += 1.0 * 2 / 180 * Math.PI
      count++;
      await sleep(25)
    }
    await sleep(400)
    for (i=0;i<danmakuList.length;i++){
      danmakuList[i].state = 1;
    }
  }
})

/*$('.anima-start').click(async function(){  波与粒
    var drespeed = 0;
    var flag = true;
    var drea = 0;
    while(flag)
    {
      var ways = 6
      var cd = 100
      for (i=0;i<ways;i++){
        let $node = $('<div class="anima-node"></div>')
        let radian = (360 / ways * i + drespeed) * Math.PI / 180;
        let css = {
          "position":"absolute",
          "top":300 + Math.cos(radian) * 20,
          "left":400 + Math.sin(radian) * 20
        }
        $node.css(css).appendTo('#canvas')
        $node.animate({
          "top":300 + Math.cos(radian) * 300,
          "left":400 + Math.sin(radian) * 300
        },4000,"easeInQuad",function(){
          $node.remove()
        })
      }
      await sleep(cd);
      drea +=0.5
      drespeed = (drespeed + drea) % 360
    }
  })*/

/*$('.anima-start').click(async function(){ 弹幕结界
    var drespeed = 0;
    var flag = 0;
    var drea = 0;
    var r1 = 0;
    var r2 = 360;
    var radian = 0;
    while(flag <= 300)
    {
      for (i = 0 ;i <= 1;i++){
        let r = radian + (1 - i) * Math.PI 
        let $node = $('<div class="anima-node"></div>')
        let css = {
          "position":"absolute",
          "top":300 + Math.cos(r) * Math.sqrt(r2*r2-r1*r1),
          "left":400 + Math.sin(r) * Math.sqrt(r2*r2-r1*r1)
        }
        $node.css(css).appendTo('.canvas')
        $node.animate({
          "top":300 + Math.cos(r - Math.PI / 2) * r1 * 2 - Math.cos(r) * Math.sqrt(r2*r2-r1*r1),
          "left":400 + Math.sin(r - Math.PI / 2) * r1 * 2 - Math.sin(r) * Math.sqrt(r2*r2-r1*r1)
        },r2*15,"linear",function(){
          $node.remove()
        })
      }
      r1 += 0.5
      r2 -= 0.5
      radian += 1.0 * 2 / 180 * Math.PI
      flag++;
    }
  })*/