export type CardTheme = "ink" | "neon";

const W = 1080;
const H = 1440;

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  let line = "";
  for (const ch of text) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawBackground(ctx: CanvasRenderingContext2D, theme: CardTheme) {
  ctx.textAlign = "center";
  if (theme === "ink") {
    ctx.fillStyle = "#f4efe6";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#8a8374";
    ctx.font = "32px serif";
    ctx.fillText("此 刻 回 信", W / 2, 120);
  } else {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0b0b14");
    bg.addColorStop(1, "#151027");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const glow = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, 620);
    glow.addColorStop(0, "rgba(139,92,246,0.28)");
    glow.addColorStop(1, "rgba(139,92,246,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "32px sans-serif";
    ctx.fillText("此 刻 回 信", W / 2, 120);
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

let qrImage: HTMLImageElement | null = null;
let qrPromise: Promise<HTMLImageElement | null> | null = null;

function loadQR(): Promise<HTMLImageElement | null> {
  if (qrImage) return Promise.resolve(qrImage);
  if (!qrPromise) {
    qrPromise = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        qrImage = img;
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = "/qr.png";
    });
  }
  return qrPromise;
}

export function renderCard(reply: string, theme: CardTheme): string {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  drawBackground(ctx, theme);

  if (theme === "ink") {
    ctx.fillStyle = "#1f1b16";
    ctx.font = "58px serif";
  } else {
    ctx.fillStyle = "#f5f3ff";
    ctx.font = "56px sans-serif";
    ctx.shadowColor = "rgba(167,139,250,0.9)";
    ctx.shadowBlur = 28;
  }
  const lines = wrapText(ctx, reply, W - 240);
  let y = 580;
  for (const l of lines) {
    ctx.fillText(l, W / 2, y);
    y += 92;
  }
  ctx.shadowBlur = 0;

  if (theme === "ink") {
    ctx.fillStyle = "#6b6252";
    ctx.font = "36px serif";
    ctx.fillText("—— 另一个时空的你", W / 2, y + 90);

    const seal = 96;
    ctx.fillStyle = "#b83a2a";
    ctx.fillRect(W / 2 - seal / 2, H - 220, seal, seal);
    ctx.fillStyle = "#f4efe6";
    ctx.font = "44px serif";
    ctx.fillText("回", W / 2, H - 220 + 66);
  } else {
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "34px sans-serif";
    ctx.fillText("—— 另一个时空的你", W / 2, y + 90);
  }

  return canvas.toDataURL("image/png");
}

export async function renderShareCard(
  userText: string,
  reply: string,
  theme: CardTheme
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  drawBackground(ctx, theme);

  const quote = `“${truncate(userText.trim(), 60)}”`;
  if (theme === "ink") {
    ctx.fillStyle = "#8a8374";
    ctx.font = "36px serif";
  } else {
    ctx.fillStyle = "#9ca3af";
    ctx.font = "34px sans-serif";
  }
  const userLines = wrapText(ctx, quote, W - 200).slice(0, 4);
  let y = 320;
  for (const l of userLines) {
    ctx.fillText(l, W / 2, y);
    y += 56;
  }

  y += 70;
  if (theme === "ink") {
    ctx.fillStyle = "#1f1b16";
    ctx.font = "58px serif";
  } else {
    ctx.fillStyle = "#f5f3ff";
    ctx.font = "56px sans-serif";
    ctx.shadowColor = "rgba(167,139,250,0.9)";
    ctx.shadowBlur = 28;
  }
  const replyLines = wrapText(ctx, reply, W - 240);
  for (const l of replyLines) {
    ctx.fillText(l, W / 2, y);
    y += 92;
  }
  ctx.shadowBlur = 0;

  if (theme === "ink") {
    ctx.fillStyle = "#6b6252";
    ctx.font = "36px serif";
  } else {
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "34px sans-serif";
  }
  ctx.fillText("—— 另一个时空的你", W / 2, y + 60);

  if (theme === "ink") {
    ctx.fillStyle = "#6b6252";
    ctx.font = "32px serif";
  } else {
    ctx.fillStyle = "#9ca3af";
    ctx.font = "28px sans-serif";
  }
  ctx.fillText("长按识别二维码，写下此刻最想说的话", W / 2, H - 380);

  const qr = await loadQR();
  if (qr) {
    const size = 220;
    const pad = 20;
    const qx = W / 2 - size / 2;
    const qy = H - 320;
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, qx - pad, qy - pad, size + pad * 2, size + pad * 2, 24);
    ctx.fill();
    ctx.drawImage(qr, qx, qy, size, size);
  }

  if (theme === "ink") {
    ctx.fillStyle = "#a63d2f";
    ctx.font = "30px serif";
  } else {
    ctx.fillStyle = "#e9d5ff";
    ctx.font = "28px sans-serif";
  }
  ctx.fillText("说不出口的话，另一个时空替你接住", W / 2, H - 24);

  return canvas.toDataURL("image/png");
}
