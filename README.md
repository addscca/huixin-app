# 此刻回信

深夜说不出口的话，写一句，另一个时空的你，替你接住。

一个面向大学生深夜情绪场景的轻量 AI 产品：用户写下一句此刻的真实感受，AI 以「另一个时空的你」身份回信——会撒娇、会嘴硬心软，但最后一定接住你。回复可一键生成水墨/霓虹两种卡片，保存到相册、分享到朋友圈，分享卡底部的二维码把新朋友带回产品。

## 线上体验

https://huixin-app.sealoshzh.site

## 它是怎么工作的

1. 写一句此刻的感受
2. DeepSeek 以「另一个时空的你」身份回信（口语、有情绪、一到两句）
3. Canvas 前端把回复渲染成 1080×1440 的情绪卡 / 分享卡
4. 手机端一键存相册（Web Share API），分享卡自带二维码回流

## 技术栈

- Next.js 16（App Router）+ TypeScript
- Tailwind CSS 4
- DeepSeek Chat API（服务端 route 调用）
- Canvas 前端卡片渲染 + Web Share API 存相册
- PWA（manifest + 图标），手机可添加到主屏幕
- Docker + Sealos 部署，Kaniko 集群内构建镜像

## 本地运行

```bash
npm install
npm run dev
```

在 `.env.local` 中配置：

```
DEEPSEEK_API_KEY=你的DeepSeek密钥
```

## 制作过程

完整的定位、决策与迭代记录见 [`BUILD_LOG.md`](BUILD_LOG.md)。

## 部署

镜像构建与发布流程见 `BUILD_LOG.md` 的部署章节，或直接参考仓库内 `Dockerfile`。