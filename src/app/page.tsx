"use client";

import { useEffect, useState } from "react";
import { renderCard, renderShareCard, type CardTheme } from "@/lib/card";

type Mode = "card" | "share";

export default function Home() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<CardTheme>("ink");
  const [mode, setMode] = useState<Mode>("card");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!reply) return;
    let cancelled = false;
    async function draw() {
      const dataUrl =
        mode === "share"
          ? await renderShareCard(text, reply, theme)
          : renderCard(reply, theme);
      if (!cancelled) setPreview(dataUrl);
    }
    draw();
    return () => {
      cancelled = true;
    };
  }, [reply, theme, mode, text]);

  async function send() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");
    setReply("");
    setPreview("");
    try {
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "出错了，再试一次");
      } else {
        setReply(data?.reply || "");
      }
    } catch {
      setError("网络开小差了，再试一次");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!reply) return;
    try {
      await navigator.clipboard.writeText(reply);
    } catch {}
  }

  function download() {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = mode === "share" ? "此刻回信-分享.png" : "此刻回信.png";
    a.click();
  }

  async function saveToAlbum() {
    if (!preview) return;
    try {
      const res = await fetch(preview);
      const blob = await res.blob();
      const file = new File(
        [blob],
        mode === "share" ? "此刻回信-分享.png" : "此刻回信.png",
        { type: "image/png" }
      );
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "此刻回信" });
        return;
      }
    } catch {}
    download();
  }

  return (
    <main className="min-h-screen bg-[#0b0b10] text-zinc-100 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-wide">此刻回信</h1>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            深夜说不出口的话，写一句。
            <br />
            另一个时空的你，替你接住。
          </p>
        </header>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="写下一句此刻的真实感受，比如：今天面试被刷了，不敢跟爸妈说"
          rows={4}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-[15px] leading-relaxed placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none"
        />

        <button
          onClick={send}
          disabled={loading || !text.trim()}
          className="mt-4 w-full rounded-xl bg-amber-300/90 text-zinc-900 font-semibold py-3 hover:bg-amber-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "他在写……" : "寄出"}
        </button>

        {error && (
          <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
        )}

        {reply && (
          <section className="mt-8 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 p-6">
            <p className="text-[17px] leading-loose whitespace-pre-wrap">{reply}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-zinc-500">—— 另一个时空的你</span>
              <button
                onClick={copy}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition"
              >
                复制
              </button>
            </div>
          </section>
        )}

        {reply && (
          <section className="mt-6">
            <div className="flex gap-2">
              {(
                [
                  ["card", "情绪卡"],
                  ["share", "分享卡"],
                ] as [Mode, string][]
              ).map(([m, label]) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium border transition ${
                    mode === m
                      ? "bg-amber-300/90 text-zinc-900 border-transparent"
                      : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              {(["ink", "neon"] as CardTheme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium border transition ${
                    theme === t
                      ? "bg-white/10 text-white border-white/30"
                      : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {t === "ink" ? "水墨" : "霓虹"}
                </button>
              ))}
            </div>

            {preview && (
              <img
                src={preview}
                alt="此刻回信卡片"
                className="mt-4 w-full rounded-xl border border-white/10"
              />
            )}

            <button
              onClick={saveToAlbum}
              className="mt-4 w-full rounded-xl bg-amber-300/90 text-zinc-900 font-semibold py-3 hover:bg-amber-200 transition"
            >
              保存到相册
            </button>
            <p className="mt-2 text-center text-xs text-zinc-500">
              手机点「保存图片」即存入相册，电脑会直接下载文件
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
