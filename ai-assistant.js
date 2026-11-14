
/* NEXUS AI — Mobile positioning and keyboard fix */
(() => {
  'use strict';

  const root = document.createElement('div');
  root.id = 'nexusAI';

  root.innerHTML = `
    <button class="nai-launcher" id="naiLauncher" type="button"
      aria-label="Open NEXUS AI coding assistant" aria-expanded="false">
      <span class="nai-launcher-spark">✦</span>
      <span class="nai-launcher-label">NEXUS AI</span>
      <span class="nai-online-dot"></span>
    </button>

    <section class="nai-panel" id="naiPanel"
      aria-label="NEXUS AI coding assistant" aria-hidden="true">

      <header class="nai-header">
        <div class="nai-brand-mark">✦</div>
        <div class="nai-heading">
          <strong>NEXUS AI</strong>
          <small>Your personal coding mentor</small>
        </div>
        <span class="nai-status"><i></i> READY</span>
        <button class="nai-close" id="naiClose"
          type="button" aria-label="Close assistant">×</button>
      </header>

      <div class="nai-trust">
        LEARN <b>·</b> BUILD <b>·</b> DEBUG <b>·</b> IMPROVE
      </div>

      <div class="nai-messages" id="naiMessages" aria-live="polite">
        <article class="nai-message nai-ai">
          <div class="nai-avatar">✦</div>
          <div class="nai-bubble">
            <strong>Hey, developer! 👋</strong>
            <p>I'm your NEXUS AI mentor. Ask me to explain a concept,
            write code, debug an error or guide you step by step.</p>
            <p class="nai-hint">
              Tip: Tell me your programming language and what you're trying to build.
            </p>
          </div>
        </article>
      </div>

      <div class="nai-suggestions" id="naiSuggestions">
        <button type="button" data-prompt="Explain variables and data types in Python with simple examples.">
          Explain a concept
        </button>
        <button type="button" data-prompt="Help me debug my code. Tell me what information you need.">
          Debug my code
        </button>
        <button type="button" data-prompt="Give me a beginner coding challenge and guide me without revealing the answer immediately.">
          Give me a challenge
        </button>
      </div>

      <form class="nai-composer" id="naiForm">
        <textarea id="naiInput" rows="1" maxlength="5000"
          placeholder="Ask NEXUS AI anything about coding…"
          aria-label="Message NEXUS AI"></textarea>
        <button id="naiSend" type="submit" aria-label="Send message">
          <span>➤</span>
        </button>
      </form>

      <footer class="nai-footer">
        <span>AI can make mistakes. Verify code before running.</span>
        <button id="naiClear" type="button">New chat</button>
      </footer>
    </section>
  `;

  document.body.append(root);

  const $ = id => document.getElementById(id);

  const launcher = $('naiLauncher');
  const panel = $('naiPanel');
  const messagesEl = $('naiMessages');
  const input = $('naiInput');
  const send = $('naiSend');

  let history = [];
  let busy = false;
  let client = null;
  let userSession = null;

  const base = location.pathname.slice(
    0,
    location.pathname.lastIndexOf('/') + 1
  );

  /* Safe message renderer */
  function addText(container, text) {
    const chunks = String(text || '').split(/```([\w+#.-]*)\n([\s\S]*?)```/g);

    for (let i = 0; i < chunks.length; i++) {
      if (i % 3 === 2) {
        const pre = document.createElement('pre');
        pre.className = 'nai-code';

        const code = document.createElement('code');
        code.textContent = chunks[i];
        pre.append(code);

        const copy = document.createElement('button');
        copy.type = 'button';
        copy.className = 'nai-copy';
        copy.textContent = 'Copy';

        copy.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(chunks[i]);
            copy.textContent = 'Copied';
            setTimeout(() => copy.textContent = 'Copy', 1400);
          } catch {
            copy.textContent = 'Select code';
          }
        });

        pre.append(copy);
        container.append(pre);
        continue;
      }

      if (i % 3 === 1) continue;

      chunks[i].split(/\n/).forEach(line => {
        if (!line.trim()) return;

        const p = document.createElement('p');
        const parts = line.split(/(`[^`]+`)/g);

        parts.forEach(part => {
          if (part.startsWith('`') && part.endsWith('`')) {
            const c = document.createElement('code');
            c.textContent = part.slice(1, -1);
            p.append(c);
          } else {
            p.append(
              document.createTextNode(
                part.replace(/^\s*[-*]\s+/, '• ')
              )
            );
          }
        });

        container.append(p);
      });
    }
  }

  /* Add chat message */
  function addMessage(role, text, pending = false) {
    const article = document.createElement('article');

    article.className =
      `nai-message ${role === 'user' ? 'nai-user' : 'nai-ai'}`;

    if (role !== 'user') {
      const avatar = document.createElement('div');
      avatar.className = 'nai-avatar';
      avatar.textContent = '✦';
      article.append(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'nai-bubble';

    if (pending) {
      bubble.innerHTML =
        '<span class="nai-typing"><i></i><i></i><i></i></span>' +
        '<span class="nai-thinking">Thinking…</span>';
    } else {
      addText(bubble, text);
    }

    article.append(bubble);
    messagesEl.append(article);

    messagesEl.scrollTop = messagesEl.scrollHeight;

    return { article, bubble };
  }

  /* Open and close panel */
  function toggle(open) {
    const state = typeof open === 'boolean'
      ? open
      : !panel.classList.contains('open');

    panel.classList.toggle('open', state);
    panel.setAttribute('aria-hidden', String(!state));

    launcher.setAttribute('aria-expanded', String(state));
    launcher.classList.toggle('active', state);

    if (state) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  launcher.addEventListener('click', () => toggle());
  $('naiClose').addEventListener('click', () => toggle(false));

  /* New conversation */
  $('naiClear').addEventListener('click', () => {
    history = [];
    messagesEl.innerHTML = '';

    addMessage(
      'assistant',
      'New chat started! What would you like to learn or build today?'
    );
  });

  /* Suggested prompts — no automatic keyboard opening */
  $('naiSuggestions').addEventListener('click', e => {
    const button = e.target.closest('[data-prompt]');

    if (button) {
      input.value = button.dataset.prompt;
      $('naiSuggestions').style.display = 'none';
    }
  });

  /* Input resizing */
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height =
      Math.min(input.scrollHeight, 110) + 'px';
  });

  /* Enter to send */
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      $('naiForm').requestSubmit();
    }
  });

  /* Supabase client */
  async function initClient() {
    if (client) return client;

    if (!window.supabase?.createClient) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');

        script.src =
          'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

        script.onload = resolve;
        script.onerror = reject;

        document.head.append(script);
      });
    }

    if (
      !window.NEXUS_SUPABASE_URL ||
      !window.NEXUS_SUPABASE_ANON_KEY
    ) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');

        script.src = base + 'supabase-config.js';
        script.onload = resolve;
        script.onerror = reject;

        document.head.append(script);
      });
    }

    if (
      !window.NEXUS_SUPABASE_URL ||
      !window.NEXUS_SUPABASE_ANON_KEY
    ) {
      throw new Error('Supabase is not configured.');
    }

    client = window.supabase.createClient(
      window.NEXUS_SUPABASE_URL,
      window.NEXUS_SUPABASE_ANON_KEY
    );

    const { data } = await client.auth.getSession();
    userSession = data.session;

    client.auth.onAuthStateChange((_event, session) => {
      userSession = session;
    });

    return client;
  }

  /* Current page context */
  function pageContext() {
    const page = location.pathname.split('/').pop() || 'home';

    const language =
      new URLSearchParams(location.search).get('language') || '';

    return `Page: ${page}. ${
      language ? `Selected language: ${language}.` : ''
    }`;
  }

  /* Send message to Gemini through Supabase */
  async function ask(question) {
    if (busy || !question.trim()) return;

    busy = true;
    send.disabled = true;
    input.disabled = true;

    $('naiSuggestions').style.display = 'none';

    addMessage('user', question);

    history.push({
      role: 'user',
      content: question
    });

    const pending = addMessage('assistant', '', true);

    try {
      const supa = await initClient();

      const { data: sessionData } =
        await supa.auth.getSession();

      userSession = sessionData.session;

      if (!userSession?.access_token) {
        throw new Error(
          'Please sign in to your NEXUS ACADEMY student account first. ' +
          'Your AI tutor is available to signed-in students.'
        );
      }

      const { data, error } =
        await supa.functions.invoke('nexus-ai', {
          body: {
            messages: history.slice(-12),
            context: pageContext()
          }
        });

      if (error) {
        throw new Error(
          error.message || 'The AI service could not be reached.'
        );
      }

      if (!data?.reply) {
        throw new Error(
          data?.error || 'The AI assistant returned an empty response.'
        );
      }

      pending.article.remove();

      addMessage('assistant', data.reply);

      history.push({
        role: 'assistant',
        content: data.reply
      });

    } catch (err) {
      pending.article.remove();

      addMessage(
        'assistant',
        `**I couldn't complete that request.**\n` +
        `${err.message || 'Please try again.'}\n\n` +
        `If you have not signed in yet, open the Academy home page ` +
        `and use **Student login**.`
      );

    } finally {
      busy = false;
      send.disabled = false;
      input.disabled = false;
      input.value = '';
      input.style.height = 'auto';

      messagesEl.scrollTop = messagesEl.scrollHeight;

      /* IMPORTANT:
         Do not call input.focus() here.
         It can force the mobile keyboard open and shift the panel.
      */
    }
  }

  $('naiForm').addEventListener('submit', e => {
    e.preventDefault();

    const question = input.value.trim();

    if (question) ask(question);
  });

  /* Escape key closes assistant */
  document.addEventListener('keydown', e => {
    if (
      e.key === 'Escape' &&
      panel.classList.contains('open')
    ) {
      toggle(false);
    }
  });

})();
