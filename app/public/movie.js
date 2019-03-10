var danmaku = {
  list: [
  ],
  index: 0,
  path: [
    {
      time: 0,
      delay: 0
    },
    {
      time: 0,
      delay: 0
    },
    {
      time: 0,
      delay: 0
    },
    {
      time: 0,
      delay: 0
    },
    {
      time: 0,
      delay: 0
    }
  ],
  path_reset: function () {
    for (i = 0; i < this.path.length; i++) {
      this.path[i].time = 0;
      this.path[i].delay = 0;
    }
  }
};
function list_cmp(a, b) {
  if (a.time > b.time) return 1;
  else if (a.time < b.time) return -1;
  else return 0;
}
function timeToString(time) {
  function getZero(number) {
    return number < 10 ? "0" + number : "" + number;
  }
  var minute = parseInt(time / 60);
  var second = parseInt(time % 60);
  return getZero(minute) + ":" + getZero(second);
}
$(document).ready(function () {
  $.ajax({
    url: '../api/get',
    type: 'get',
    dataType: 'json',
    success: function (res, xml) {
      danmaku.list = res.list
      danmaku.list.sort(list_cmp)
    },
    error: function (status) {
      //失败后执行的代码
    }
  });
  var video = document.getElementById("player");
  video.oncanplay = function () {
    $("#duration").text(timeToString(video.duration));
  };
  var progress = {
    xstart: 0, //开始点击时鼠标的x值
    width: 0, //进度条宽度
    mousedown: 0, //点击状态
    left: document.getElementById("box-left"), //进度条左区域对象
    right: document.getElementById("box-right"), //进度条右区域对象
    time: 0,
    timeChange: 0,
    //宽度更新函数
    change: function (new_width) {
      timeChange = 1;
      if (new_width >= 0 && new_width <= 600) {
        $("#box-left").css("width", new_width);
        $("#box-right").css("width", 600 - new_width);
      } else if (new_width < 0) {
        $("#box-left").css("width", 0);
        $("#box-right").css("width", 600);
      } else {
        $("#box-left").css("width", 600);
        $("#box-right").css("width", 0);
      }
    }
  };
  var node = document.getElementById("node");
  function mousedown(e) {
    var e = e || window.event;
    progress.xstart = e.clientX;
    progress.width = e.clientX - node.offsetLeft + $("#box-left").width() - 7;
    progress.mousedown = 1;
    progress.change(progress.width);
    danmaku.path_reset();
    video.currentTime = (progress.width / 600) * video.duration;
    $(".danmaku-span").remove();
  }
  node.onmousedown = progress.left.onmousedown = progress.right.onmousedown = mousedown;
  document.onmousemove = function (e) {
    if (progress.mousedown === 1) {
      var e = e || window.event;
      var width = e.clientX - progress.xstart + progress.width;
      progress.change(width);
      video.currentTime = (width / 600) * video.duration;
    }
  };
  document.onmouseup = function () {
    if (progress.mousedown == 1) {
      danmaku.index = 0;
      while (danmaku.index < danmaku.list.length && danmaku.list[danmaku.index].time < video.currentTime) {
        danmaku.index++;
      }
      progress.mousedown = 0;
    }
  };
  $("#play").click(function () {
    if (video.paused) {
      video.play();
      $("#play").attr("src", "icon/stop.png");
      var danmaku_item = $(".danmaku-span");
      for (i = 0; i < danmaku_item.length; i++) {
        var element = danmaku_item.eq(i);
        //重新计算动画时间
        var speed =
          ((30 - element.text().length) *
            250 *
            (parseInt(element.css("left")) + element.width())) /
          ($("#audio-box").width() + element.width());
        element.animate(
          {
            left: -1 * element.width()
          },
          speed,
          "linear",
          function () {
            // 当动画结束后，删除该元素
            element.remove();
          }
        );
      }
    } else {
      video.pause();
      $("#play").attr("src", "icon/bofang.png");
      $(".danmaku-span").stop();
    }
  });
  video.ontimeupdate = function () {
    var curTime = video.currentTime;
    $("#currentTime").text(timeToString(curTime));
    if (progress.mousedown === 0) {
      progress.change(parseInt((600 * curTime) / video.duration));
      while (
        danmaku.index < danmaku.list.length &&
        danmaku.list[danmaku.index].time < curTime
      ) {
        var speed = (30 - danmaku.list[danmaku.index].text.length) * 250
        var road = {
          index: 0,
          time: 9999999
        };
        let $span = $('<span class="danmaku-span"></span>');
        var css = {
          position: "absolute",
          left: $("#audio-box").width(),
          color: "white",
          "z-index": 1,
          "font-size": 30
        };
        $span.text(danmaku.list[danmaku.index].text)
          .css(css)
          .appendTo("#audio-box");
          var total_width = $span.width() + $("#audio-box").width()
        for (i = 0; i < danmaku.path.length; i++) {
          if (curTime > danmaku.path[i].delay && 1.0 * $("#audio-box").width() / total_width * speed / 1000 + curTime > danmaku.path[i].time) {
            road.index = i;
            break;
          }
          else if (road.time > - 1.0 * $("#audio-box").width() / total_width * speed / 1000 - curTime + danmaku.path[i].time) {
            road.index = i;
            road.time = - 1.0 * $("#audio-box").width() / total_width * speed / 1000 - curTime + danmaku.path[i].time
          }
        }
        $span.css('top', 10 + 40 * road.index);
        danmaku.path[road.index].time = curTime + 1.0 * speed / 1000;
        danmaku.path[road.index].delay = curTime + 1.0 * speed * $span.width() / total_width / 1000
        $span.animate(
          {
            left: -1 * $span.width()
          },
          speed,
          "linear",
          function () {
            // 当动画结束后，删除该元素
            $span.remove();
          }
        );
        danmaku.index++;
      }
    }
  };
  var button = document.getElementById('danmaku-submit')
  button.onclick = function () {
    $.ajax({
      url: '../api/post',
      type: 'post',
      dataType: 'json',
      data: {
        text: $('#danmaku-input').val(),
        time: video.currentTime + 1
      },
      success: function (res, xml) {
        var insert = danmaku.index;
        while (video.currentTime + 0.5 > danmaku.list[insert].time && insert < danmaku.list.length) {
          insert++;
        }
        var newItem = {
          text: $('#danmaku-input').val(),
          time: video.currentTime + 0.5
        }
        danmaku.list.splice(insert, 0, newItem);
      },
      error: function (status) {
        alert('发送失败，可能是你发了什么不太好的东西(╯﹏╰)b')
      }
    });
    return false;
  }
});

