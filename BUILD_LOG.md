# 制作日志 · 此刻回信

> 深夜说不出口的话，写一句，另一个时空的你，替你接住。

## 一、定位

- 面向大学生深夜情绪场景的轻量 AI 表达产品。
- 用户写下一句此刻的真实感受，AI 以「另一个时空的你」身份回信，再把回复变成一张能存相册、能分享的卡片。
- 目标：先跑通「短期的、能收获观众并创造收益」的最小闭环，不急于做成长期社交产品。

## 二、关键决策

1. 先是产品，再是中国风。中国风是皮肤，不是内核。
2. 戳的是情感需求，不是功能测试。早期「共鸣测试 + 表达卡」被否，因为标签过时、无法共情；收敛到「写一句真实感受 → 被接住」。
3. AI 人设参考 cyder-xiaoya：会撒娇、假装生气、嘴硬心软，表达带情绪化烙印，而不是客服式安慰。
4. 形态先做网站/PWA（手机可添加到主屏幕），不急着上小程序/App，先把「存相册顺手、访问不麻烦」做扎实。

## 三、核心流程

写一句 → `POST /api/reply` → DeepSeek 回信 → 前端 Canvas 渲染卡片（情绪卡/分享卡、水墨/霓虹）→ 一键存相册（Web Share）→ 分享卡底部二维码回流。

## 四、技术实现

- Next.js 16（App Router）+ TypeScript + Tailwind CSS 4
- 服务端 `src/app/api/reply/route.ts` 调用 DeepSeek Chat API，system prompt 定制人设
- `src/lib/card.ts` 用 Canvas 生成 1080×1440 卡片
- `src/app/page.tsx` 交互与存相册（`navigator.share` + 回退下载）
- PWA：`public/manifest.webmanifest` + 图标
- 部署：Docker + Sealos（Kubernetes），Kaniko 集群内构建镜像推 Harbor

## 五、迭代记录

- v1：MVP。写一句 → 回信 → 卡片下载（文件模式）。
- v2：图片改为「保存到相册」（手机 Web Share，失败回退下载）；加入 PWA 与中文标题，优化手机访问。
- v3：分享卡底部加入二维码，扫码回流。
- v4：二维码下方加戳人文案「深夜没人接的话，这里有人接」。
- v5：二维码放大、提示语改为「长按识别二维码」，文案收敛为「说不出口的话，另一个时空替你接住」。

## 六、部署

- 镜像：`harbor.hzh.sealos.run/ns-1ocwmruv/huixin-app`
- 构建：源码 tar 打包进 Secret → Kaniko Job（`--context=tar://`）→ 推 Harbor → `kubectl set image` 滚动更新
- 环境变量：`DEEPSEEK_API_KEY`（配置在 Deployment，不进代码库）
- 线上：https://huixin-app.sealoshzh.site

## 七、下一步

- 文案与卡片视觉继续打磨
- 访问统计、分享回流数据
- 尝试小程序/App 形态