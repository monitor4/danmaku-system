var imgSrc = ['./image/polybridge_1.gif','./image/polybridge_2.gif','./image/polybridge_3.gif','./image/polybridge_4.gif',
  './image/polybridge_5.gif','./image/polybridge_6.gif','./image/polybridge_7.gif','./image/polybridge_8.gif']
$(document).ready(function(){
  var imgBox = document.getElementsByClassName('imgList')[0];
  imgBox.onmouseover = function(){
    document.getElementById('arraw').src = "./icon/left.png"
  };
  imgBox.onmouseout = function(){
    document.getElementById('arraw').src = "./icon/right.png"
  }
  for (i=0;i<imgSrc.length;i++){
    let canvas = document.createElement('canvas')
    let img=new Image();
    img.src=imgSrc[i]
    
    canvas.width=200
    canvas.height=130
    img.onload = function(){
      let ctx = canvas.getContext('2d')
      ctx.drawImage(img,0,0,200,130)
      let img64 = canvas.toDataURL("image/jpeg", 0.92);
      let $img = $('<img class="preview""></img>')
      $img.attr({"src":img64,"data-src":img.src});
      $img.appendTo('.imgList')
      $img.click(function(){
        console.log(1)
        $('.imgContent').attr('src',img.src)
      })
    }
  }
})