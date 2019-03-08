var index = 0;

$(document).ready(function() {
  danmaku.list.sort(list_cmp);
  //设置导航栏
  $("#tabbedPanel").tabs();
  //获取导航栏项列表
  var tab = $("ul li a");
  //首页粗体化
  tab.eq(index).css("font-weight", "bold");
  var list = document.querySelectorAll("li a");
  //导航栏项绑定顺序
  for (var i = 0; i < list.length; i++) {
    list[i].index = i;
  }
  //导航栏点击后修改对应样式
  $("ul li a").click(function(e) {
    var tab = $("ul li a");
    tab.eq(e.target.index).css("font-weight", "bold");
    tab.eq(index).css("font-weight", "normal");
    index = e.target.index;
  });
});
