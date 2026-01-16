/* docs/javascripts/progress.js - 纯净进度条版 */

document$.subscribe(function() {
  // 1. 创建进度条元素
  if (!document.getElementById("reading-progress")) {
    var progressBar = document.createElement("div");
    progressBar.id = "reading-progress";
    // 样式：固定在顶部，蓝色渐变，高度3px
    progressBar.style.cssText = "position:fixed;top:0;left:0;z-index:9999;width:0%;height:3px;background:linear-gradient(to right, #4facfe 0%, #00f2fe 100%);pointer-events:none;transition:width 0.1s;";
    document.body.appendChild(progressBar);
  }

  // 2. 监听滚动事件更新长度
  window.addEventListener("scroll", function() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("reading-progress").style.width = scrolled + "%";
  });
});