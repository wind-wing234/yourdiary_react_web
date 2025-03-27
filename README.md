# YourDiary - 你的日记第三方网页端 ✍️

<div align="center">
  <img src="https://img.shields.io/badge/React-18.0-blue?logo=react" alt="React-18.0"/>
  <img src="https://img.shields.io/badge/Material--UI-6.4.3-indigo?logo=mui" alt="Material--UI-6.4.3"/>
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License-MIT"/>
  <br>
</div>

> <cite>ワシらの作る組紐もせやから神さまの技、時間の流れのそのものを顕しとる。寄り集まって形を作り、捻れて絡まって、時には戻って、途切れ、またつながり。それが結び。それが時間。</cite>
>
> <cite>我们所编织的绳结也是如此，那是神的技艺，显现了时间流动本身。
> 聚在一起、成型、扭曲、缠绕，有时又还原、断裂、再次连接。
> 那就是结，那就是时间。</cite>
>
> ——<cite>《君の名は》</cite>

## 🌟 项目简介

**YourDiary** 是一个基于「你的日记」APP 接口开发的第三方网页版前端，致力于为用户提供舒适的大屏日记书写体验。基于 **React** 框架和 **Material-UI** 组件库打造，旨在让日记记录更直观、更高效。

**想立刻尝试？在线 demo：[YourDiary](https://diary.nahhan.me/)**

注意：虽然已经经过一定的测试，部分功能仍可能存在不稳定性。如遇 bug 请积极联系开发者修复。

## 关于「你的日记」

「你的日记」是一款灵感来源于动画电影《你的名字》的日记应用。除了可以方便地记录自己的每一天，你还可以穿过0和1的数据流，和一个 TA 建立连接，与对方交换每天的<s><em>生活</em></s> 日记。

<s><em>不需要喝口嚼酒</em></s>

本项目的作者是「你的日记」的忠实用户，希望通过这个网页版，让更多人发现并享受它的魅力。

**了解更多：**

- <a href="https://nideriji.cn/">「你的日记」官网</a>
- <a href="https://www.taptap.cn/app/37960/all-info">「你的日记」安卓</a>
- <a href="https://apps.apple.com/cn/app/%E4%BD%A0%E7%9A%84%E6%97%A5%E8%AE%B0/id1183155138">「你的日记」 iOS</a>

## 🚀 核心功能

| 模块 | 功能 |
|------|------|
| 登录系统 | 邮箱密码登录 |
| 日记管理 | 增删改查全套操作 |
| 日历视图 | 快速浏览和选择日记 |
| 对方日记 | <s><em>跨时空</em></s>阅读状态同步 |
| 快速编辑 | 智能快捷键支持 |

- **快捷键支持**：
  - `Tab` 插入双空格缩进
  - `Ctrl+D` 插入时间戳
  - `Ctrl+S` 保存

## 🎯 未来计划

- [ ] **主题色可修改** ：目前只能用红蓝CP

- [ ] **预加载和缓存**：所点即所得

- [ ] **Electron 桌面版**：喜报，又一个 Chrome 启动器

- [ ] **暗夜模式**：或许深夜和写日记更配哦

- [ ] **图片支持**：才不是因为懒

- [ ] **打包大小优化**：才不是因为懒

## 🛠️ 如何部署

**如果需要本地开发：**

   ```bash
    # 1. 克隆仓库
    git clone https://github.com/wind-wing234/yourdiary_react_web.git && cd yourdiary

    # 2. 安装依赖
    npm install

    # 3. 运行开发服务器
    npm start
   ```

   应用将在开发模式下启动，默认访问 [http://localhost:3000](http://localhost:3000) 查看。

**如果需要部署到生产环境：**

   ```bash
    # 1. 在仓库下生成生产版本
    # 这将在 `build` 文件夹中创建应用的优化版本。
    npm run build


    # 2. 使用 Nginx 等工具部署。
    # 注意配置代理，将 `/api` 请求转发至「你的日记」官方后端。

   ```

## 🧰 技术栈

- React
- TypeScript
- Material-UI
- Day.js

## 🤝 贡献指南

真诚地期待着：

- 🐛 提交Issue

- ✨ 发起PR

- 💡 提出创意提案

## 许可证

MIT License

**版权与商标**  
本项目中涉及的「你的日记」相关商标、品牌标识、及原创功能设计，其所有权均归属于「你的日记」应用程序的合法权利持有者。若权利持有者认为本项目存在任何涉嫌侵权内容，请及时联系本项目作者处理。

**免责条款**  
本项目处于持续开发阶段，部分功能可能存在不稳定性。开发者不对因使用本项目导致的账户异常、数据丢失等情况承担责任，使用即代表理解并同意。

<br>
<cite>重要的人，不能忘记的人，绝对不想忘记的人！</cite>
