# 此刻回信 · Ci Ke Hui Xin

*Say the words you can't say at night. Another you, in another time, will catch them.*

An AI emotional-companion web app for college students. Write one line about how you feel right now, and an AI persona — "the you in another time" — writes back: a little coquettish, a little tough-love, but always there to hold you. Turn the reply into an ink-wash or neon card, save it to your album, and share it to Moments; the QR code on the share card brings new friends back to the app.

## Live

https://huixin-app.sealoshzh.site

## How it works

1. Write one line about how you feel right now.
2. DeepSeek replies as "the you in another time" (spoken, emotional, one or two sentences).
3. The reply is rendered client-side into a 1080×1440 card (emotion card / share card).
4. On mobile, save to album with one tap (Web Share API); the share card includes a QR code for re-entry.

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- DeepSeek Chat API (server-side route)
- Canvas card rendering + Web Share API
- PWA (manifest + icons)
- Docker + Sealos, Kaniko in-cluster image builds

## Local development

```bash
npm install
npm run dev
```

Set in `.env.local`:

```
DEEPSEEK_API_KEY=your-deepseek-api-key
```

## Process

See [`BUILD_LOG.md`](BUILD_LOG.md) for the full product positioning, decisions, and iteration log.

## Deploy

See the deployment section in `BUILD_LOG.md`, or the `Dockerfile` in this repo.

---

## 中文简介

深夜说不出口的话，写一句，另一个时空的你，替你接住。

一个面向大学生深夜情绪场景的轻量 AI 产品：用户写下一句此刻的真实感受，AI 以「另一个时空的你」身份回信——会撒娇、会嘴硬心软，但最后一定接住你。回复可一键生成水墨/霓虹两种卡片，保存到相册、分享到朋友圈，分享卡底部的二维码把新朋友带回产品。

完整定位、关键决策与迭代记录见 [`BUILD_LOG.md`](BUILD_LOG.md)。