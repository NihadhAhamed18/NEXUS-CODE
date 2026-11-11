// NEXUS AI secure server-side proxy. Deploy as Supabase Edge Function: nexus-ai.
// Keep OPENAI_API_KEY in Supabase Function Secrets; never put it in browser files.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, "Content-Type": "application/json" },
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Please sign in to use NEXUS AI." }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) return json({ error: "NEXUS AI is not configured yet. The administrator must add the AI service key." }, 503);

    const authClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: userData, error: authError } = await authClient.auth.getUser(token);
    if (authError || !userData.user) return json({ error: "Your session has expired. Please sign in again." }, 401);

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    if (!messages.length || messages.length > 12) return json({ error: "Send between 1 and 12 recent messages." }, 400);
    const safeMessages = messages.map((m: any) => ({
      role: m?.role === "assistant" ? "assistant" : "user",
      content: String(m?.content || "").slice(0, 5000),
    })).filter((m: any) => m.content.trim());
    if (!safeMessages.length) return json({ error: "Please enter a message." }, 400);

    // Per-student hourly limit. SQL migration below creates this RPC.
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: allowed, error: limitError } = await admin.rpc("consume_nexus_ai_request", { p_user_id: userData.user.id });
    if (limitError) console.error("NEXUS AI rate-limit check failed:", limitError.message);
    if (!limitError && allowed === false) return json({ error: "You've reached the hourly AI tutor limit. Please try again later." }, 429);

    const context = String(body?.context || "NEXUS ACADEMY learning platform").slice(0, 300);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${openaiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: Deno.env.get("OPENAI_MODEL") || "gpt-4.1-mini",
        instructions: `You are NEXUS AI, a friendly, patient programming tutor inside NEXUS ACADEMY. ${context}
Teach students from beginner to advanced in Python, C, C++, Java, JavaScript, C#, PHP, Ruby, Go and Rust. Explain concepts in clear student-friendly language. When writing code, use fenced code blocks and specify the language. Explain how the code works, point out common mistakes, and encourage the student to understand rather than blindly copy. For debugging, ask for the exact code and error if missing. Prefer step-by-step hints for practice challenges unless the student explicitly asks for a full solution. Be accurate; if unsure, say so. Do not claim code was executed or tested unless it actually was. Keep answers structured and practical.`,
        input: safeMessages,
        max_output_tokens: 1200,
        store: false,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("OpenAI response error:", result?.error?.message || response.status);
      return json({ error: "The AI service is temporarily unavailable. Please try again shortly." }, 502);
    }
    const reply = (result.output || []).flatMap((item: any) => item.content || [])
      .filter((part: any) => part.type === "output_text").map((part: any) => part.text).join("\n").trim();
    if (!reply) return json({ error: "The AI service returned an empty answer. Please try again." }, 502);
    return json({ reply });
  } catch (error) {
    console.error("NEXUS AI function error:", error);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
