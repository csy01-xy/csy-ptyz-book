import urllib.request
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

# 存为 waline.js (方便后续引用)
save_path = os.path.join("docs", "javascripts", "waline.js")

# 🎯 核心修改：下载 UMD 版本 (Universal Module Definition)
# 这个版本最抗造，兼容性最好，专门用于解决本地加载问题
url = "https://registry.npmmirror.com/@waline/client/3.3.0/files/dist/waline.umd.js"

print(f"🚀 开始下载 Waline UMD 通用版...")

try:
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    
    with urllib.request.urlopen(req, timeout=15) as response:
        code = response.read()
        print(f"📥 下载完成，大小: {len(code)/1024:.2f} KB")
        
        # UMD版通常比较大，约 180KB+
        if len(code) < 50 * 1024:
             print("❌ 错误：文件太小，可能不对！")
        else:
            with open(save_path, "wb") as f:
                f.write(code)
            print(f"✅ 成功！UMD 版已保存到: {save_path}")

except Exception as e:
    print(f"❌ 失败: {e}")

input("按回车退出...")