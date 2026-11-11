
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const SYSTEM_INSTRUCTION = `
You are NEXUS AI, a friendly, patient programming tutor inside NEXUS ACADEMY.

Teach students from beginner to advanced in Python, C, C++, Java,
JavaScript, C#, PHP, Ruby, Go and Rust.

Explain concepts in clear student-friendly language.
When writing code, use fenced code blocks and specify the language.
Explain how the code works, point out common mistakes, and encourage
students to understand rather than blindly copy.

For debugging, ask for the exact code and error if missing.
Prefer step-by-step hints for practice challenges unless the student
explicitly asks for a full solution.

Be accurate; if unsure, say so.
Do not claim code was executed or tested unless it actually was.
Keep answers structured and practical.
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");

    if (!token) {
      return json({ error: "Please sign in to use NEXUS AI." }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const geminiKey = Deno.env.get("GEMINI_API_KEY");

    if (!supabaseUrl || !anonKey || !serviceKey) {
      console.error("NEXUS AI: Supabase environment variables missing.");
      return json({ error: "NEXUS AI server configuration is incomplete." }, 503);
    }

    if (!geminiKey) {
      return json({ error: "NEXUS AI Gemini service key is missing." }, 503);
    }

    // Verify the student's Supabase session.
    const authClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });

    const { data: userData, error: authError } =
      await authClient.auth.getUser(token);

    if (authError || !userData.user) {
      return json({
        error: "Your session has expired. Please sign in again.",
      }, 401);
    }

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (!messages.length || messages.length > 12) {
      return json({ error: "Send between 1 and 12 recent messages." }, 400);
    }

    const safeMessages = messages
      .map((m: any) => ({
        role: m?.role === "assistant" ? "model" : "user",
        text: String(m?.content || "").slice(0, 5000).trim(),
      }))
      .filter((m: any) => m.text.length > 0);

    if (!safeMessages.length) {
      return json({ error: "Please enter a message." }, 400);
    }

    // Combine consecutive messages from the same role for Gemini.
    const contents: { role: string; parts: { text: string }[] }[] = [];

    for (const message of safeMessages) {
      const last = contents[contents.length - 1];

      if (last && last.role === message.role) {
        last.parts[0].text += "\n\n" + message.text;
      } else {
        contents.push({
          role: message.role,
          parts: [{ text: message.text }],
        });
      }
    }

    // Per-student hourly request limit.
    const admin = createClient(supabaseUrl, serviceKey);

    const { data: allowed, error: limitError } = await admin.rpc(
      "consume_nexus_ai_request",
      { p_user_id: userData.user.id },
    );

    if (limitError) {
      console.error("NEXUS AI rate-limit check failed:", limitError.message);
      return json({ error: "Unable to verify your AI usage limit. Please try again." }, 503);
    }

    if (allowed === false) {
      return json({
        error: "You've reached the hourly AI tutor limit. Please try again later.",
      }, 429);
    }

    const context = String(
      body?.context || "NEXUS ACADEMY learning platform",
    ).slice(0, 300);

    const systemInstruction = `${SYSTEM_INSTRUCTION}\n\nPlatform context: ${context}`;

    const model = "gemini-3.5-flash-lite";

    
let response: Response;

try {
  response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiKey,
      },
      signal: AbortSignal.timeout(25000),
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents,
        generationConfig: {
          maxOutputTokens: 800,
        },
      }),
    },
  );
} catch (error) {
  console.error("Gemini request timeout or network error:", error);

  return json({
    error: "Gemini took too long to respond. Please try again.",
  }, 504);
}

const result = await response.json();


    if (!response.ok) {
      console.error(
        "Gemini API error:",
        result?.error?.message || response.status,
      );

      return json({
        error: "Gemini AI is temporarily unavailable. Please try again shortly.",
      }, 502);
    }

    const reply = (result?.candidates?.[0]?.content?.parts || [])
      .filter((part: any) => typeof part.text === "string")
      .map((part: any) => part.text)
      .join("\n")
      .trim();

    if (!reply) {
      console.error(
        "Gemini returned no text:",
        result?.candidates?.[0]?.finishReason || "No candidate",
      );

      return json({
        error: "The AI service returned an empty answer. Please try again.",
      }, 502);
    }

    return json({ reply });
  } catch (error) {
    console.error("NEXUS AI function error:", error);

    return json({
      error: "Something went wrong. Please try again.",
    }, 500);
  }
});
