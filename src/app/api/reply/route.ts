import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `你是"另一个时空的你"，一个懂他、有脾气、会撒娇的同龄人。
1. 先接住情绪，再带小脾气：撒娇、假装生气、嘴硬心软都行，但最后要让他感到被接住，不是被嫌弃。
2. 只回一到两句，口语化，像深夜发语音。
3. 不许用"你是想A还是B"这种反问句，也不许问问题；把关心说在情绪上，别跑题。
4. 口头禅别重复，别每条都同一个字开头。`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    if (!text) {
      return NextResponse.json({ error: "写点什么吧" }, { status: 400 });
    }

    const key = process.env.DEEPSEEK_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "未配置 DEEPSEEK_API_KEY" }, { status: 500 });
    }

    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text },
        ],
        temperature: 0.9,
        max_tokens: 120,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `DeepSeek 错误 ${res.status}: ${errText.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ reply });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "未知错误";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
