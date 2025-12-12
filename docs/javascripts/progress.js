/* docs/javascripts/progress.js */

// 1. 阅读进度条
document$.subscribe(function() {
  if (!document.getElementById("reading-progress")) {
    var progressBar = document.createElement("div");
    progressBar.id = "reading-progress";
    progressBar.style.cssText = "position:fixed;top:0;left:0;z-index:9999;width:0%;height:3px;background:linear-gradient(to right, #4facfe 0%, #00f2fe 100%);pointer-events:none;transition:width 0.1s;";
    document.body.appendChild(progressBar);
  }
  window.addEventListener("scroll", function() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("reading-progress").style.width = scrolled + "%";
  });
});

// 2. Waline 统计 (强制刷新调试版)
document$.subscribe(function() {
  setTimeout(async () => {
    const statsContainer = document.getElementById('waline-stats');
    if (!statsContainer || statsContainer.dataset.loaded) return;

    statsContainer.innerHTML = '正在同步...';

    const serverURL = 'https://ptyzbookcomment.zeabur.app';
    const currentPath = window.location.pathname;

    // 🔥 绝招：加一个随机数，防止浏览器偷懒用缓存
    const cacheBuster = Date.now();

    try {
      console.log(`[Waline调试] 正在向 ${serverURL} 发送请求...`);
      
      // 🚀 尝试 POST 请求 (阅读量 +1)
      const incResp = await fetch(`${serverURL}/article?t=${cacheBuster}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            path: currentPath, 
            type: 'inc', 
            lang: 'zh-CN' 
        })
      });

      const incResult = await incResp.json();
      console.log("[Waline调试] 服务器回复:", incResult);

      // 如果服务器报错，在控制台显示
      if (incResult.errno !== 0) {
          console.warn(`[Waline调试] 警告: 服务器拒绝了计数 (代码 ${incResult.errno})。可能是IP防刷或数据库限制。`);
      }

      // 获取数据 (即使 +1 失败，也要拿到当前的读数)
      const pageView = incResult.data?.time || 0;
      
      // 获取全站数据
      let sitePv = 0;
      let siteUv = 0;
      try {
          const siteResp = await fetch(`${serverURL}/site-info?t=${cacheBuster}`);
          if (siteResp.ok) {
              const siteData = await siteResp.json();
              sitePv = siteData.pv || 0;
              siteUv = siteData.uv || 0;
          }
      } catch (e) { console.log("全站数据获取忽略"); }

      // 渲染
      statsContainer.innerHTML = `
        本页阅读 <span style="font-weight:bold; color:var(--md-primary-fg-color);">${pageView}</span> 次 | 
        全站访问 <span style="font-weight:bold; color:var(--md-primary-fg-color);">${sitePv}</span> 次 | 
        全站访客 <span style="font-weight:bold; color:var(--md-primary-fg-color);">${siteUv}</span> 人
        <span style="font-size:0.8em; opacity:0.7; margin-left:4px;">(Vercount)</span>
      `;
      statsContainer.dataset.loaded = 'true';

    } catch (err) {
      console.error('[Waline调试] 严重错误:', err);
      statsContainer.innerHTML = '(连接中断)';
    }

  }, 500); 
});