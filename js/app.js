(function () {
  const course = window.ODE_COURSE;
  const math = window.ODEMath.math;
  const renderMath = window.ODEMath.renderMath;
  let state = window.ODEProgress.load();

  /* Midterm helpers */
  const midterm = course.midterm || null;
  function isForMid(topicId) {
    return midterm && midterm.topicIds.has(topicId);
  }
  function isExampleForMid(item) {
    if (!midterm) return false;
    const prov = item.provenance;
    if (prov && prov.section && midterm.sourceChapters.has(prov.section)) return true;
    /* Also check the source string for chapter references */
    const src = item.source || "";
    return midterm.sourceChapters.has(src.replace(/^Chapter\s+/, ""));
  }
  function midBadge() {
    return '<span class="mid-badge">For Mid</span>';
  }

  const els = {
    nav: document.getElementById("courseNav"),
    content: document.getElementById("appContent"),
    hero: document.getElementById("homeHero"),
    topbarTitle: document.getElementById("topbarTitle"),
    streakText: document.getElementById("streakText"),
    overallProgress: document.getElementById("overallProgress"),
    reviewBanner: document.getElementById("reviewBanner"),
    sidebar: document.getElementById("sidebar")
  };

  const topics = course.modules.flatMap((module) =>
    module.topics.map((topic) => ({ ...topic, moduleTitle: module.title, moduleId: module.id }))
  );

  function route() {
    return location.hash.replace(/^#\/?/, "") || topics[0].id;
  }

  function setRoute(value) {
    location.hash = value;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function renderNav() {
    els.nav.innerHTML = course.modules.map((module) => {
      const hasAnyMid = module.topics.some((t) => isForMid(t.id));
      return `
      <div class="nav-module">
        <h3>${module.title}${hasAnyMid ? ' <span class="mid-badge">For Mid</span>' : ''}</h3>
        ${module.topics.map((topic) => `
          <button class="nav-topic" data-route="${topic.id}">
            <span>${topic.number} ${topic.title}${isForMid(topic.id) ? ' ' + midBadge() : ''}</span>
            <span class="topic-check">${window.ODEProgress.topicComplete(state, topic.id) ? "done" : ""}</span>
          </button>
        `).join("")}
      </div>
    `;
    }).join("");

    bindRouteButtons();
  }

  function bindRouteButtons(scope = document) {
    scope.querySelectorAll("[data-route]").forEach((button) => {
      button.addEventListener("click", () => {
        setRoute(button.dataset.route);
        els.sidebar.classList.remove("open");
      });
    });
  }

  function updateActiveNav() {
    document.querySelectorAll("[data-route]").forEach((button) => {
      button.classList.toggle("active", button.dataset.route === route());
    });
  }

  function updateProgressUI() {
    const complete = topics.filter((topic) => window.ODEProgress.topicComplete(state, topic.id)).length;
    const percent = Math.round((complete / topics.length) * 100);
    els.overallProgress.style.width = `${percent}%`;
    els.streakText.textContent = `${state.streak || 0} day streak`;
  }

  function renderReviewBanner(currentTopic) {
    const visited = Object.entries(state.visited || {})
      .filter(([topicId]) => topicId !== currentTopic.id)
      .map(([topicId, date]) => ({ topic: topics.find((item) => item.id === topicId), date: new Date(date) }))
      .filter((item) => item.topic)
      .sort((a, b) => a.date - b.date);

    if (!visited.length) {
      els.reviewBanner.classList.add("hidden");
      return;
    }

    const oldest = visited[0].topic;
    els.reviewBanner.classList.remove("hidden");
    els.reviewBanner.innerHTML = `
      <span class="eyebrow">Spaced review nudge</span>
      <p class="prose">Before starting <strong>${currentTopic.title}</strong>, spend 3 minutes recalling one formula or method from <strong>${oldest.title}</strong> without looking. Then reveal your notes.</p>
      <button class="tiny-button" data-route="${oldest.id}">Review ${oldest.number}</button>
    `;
    els.reviewBanner.querySelector("[data-route]").addEventListener("click", () => setRoute(oldest.id));
  }

  function formulaList(topic) {
    return (topic.formulas || []).map((formula) => `<div class="formula-box">${math(formula, true)}</div>`).join("");
  }

  function stepsHtml(steps) {
    return `
      <div class="step-list">
        ${steps.map((item, index) => `
          <div class="step ${index === 0 ? "visible" : ""}">
            <div class="step-index">${index + 1}</div>
            <div>
              <div>${math(item.math, true)}</div>
              <div class="why"><strong>Why?</strong> ${escapeHtml(item.why)}</div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function provenanceHtml(item) {
    const provenance = item.provenance;
    if (!provenance) return "";

    const pageLabel = Array.isArray(provenance.pages)
      ? `pages ${provenance.pages.join("–")}`
      : provenance.page
        ? `page ${provenance.page}`
        : "";
    const sourceLabel = provenance.pdf
      ? [provenance.pdf, pageLabel, provenance.label].filter(Boolean).join(" · ")
      : provenance.type === "additional-practice"
        ? "Additional practice"
        : "";

    if (!sourceLabel && !provenance.note) return "";

    return `
      <div class="source-meta">
        ${sourceLabel ? `<span class="source-label">${escapeHtml(sourceLabel)}</span>` : ""}
        ${provenance.note ? `<p class="source-warning"><strong>Source note:</strong> ${escapeHtml(provenance.note)}</p>` : ""}
      </div>
    `;
  }

  function exampleCard(example, index, topicId) {
    const forMid = isForMid(topicId) || isExampleForMid(example);
    return `
      <details class="example-card${forMid ? ' for-mid' : ''}" ${index === 0 ? "open" : ""}>
        <summary>
          <div>
            <span class="eyebrow">${escapeHtml(example.source || "Worked example")}${forMid ? ' ' + midBadge() : ''}</span>
            <h3 class="example-title">${escapeHtml(example.title)}</h3>
          </div>
          <span class="tag">click to ${index === 0 ? "see" : "open"} steps</span>
        </summary>
        <p class="prose"><strong>Problem:</strong> ${math(example.problem)}</p>
        ${provenanceHtml(example)}
        ${stepsHtml(example.steps)}
        <div class="button-row">
          <button class="primary-button reveal-next">⏭️ Show next step</button>
          <button class="ghost-button reveal-all">👀 Show all steps</button>
          <button class="ghost-button reset-steps">🔄 Start over</button>
        </div>
        <p class="takeaway">💡 ${escapeHtml(example.takeaway || "")}</p>
      </details>
    `;
  }

  function practiceCard(item, topicId, index) {
    const forMid = isForMid(topicId) || isExampleForMid(item);
    return `
      <div class="practice-card${forMid ? ' for-mid' : ''}">
        <span class="eyebrow">Practice Problem ${index + 1}${forMid ? ' ' + midBadge() : ''} ✏️</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="prose"><strong>Give it a try:</strong> ${math(item.problem)}</p>
        ${provenanceHtml(item)}
        <textarea placeholder="Write your first step here... or just think it through on paper! No pressure. 😊"></textarea>
        <div class="button-row">
          <button class="ghost-button show-hint">💡 Show me a hint</button>
          <button class="primary-button show-solution">👀 Show worked solution</button>
        </div>
        <div class="hint-box hidden"><strong>Hint:</strong> ${escapeHtml(item.hint)}</div>
        <div class="solution-box hidden">${stepsHtml(item.steps)}</div>
        <div class="button-row hidden self-assess">
          <span class="tag">How did you do?</span>
          <button class="tiny-button assess" data-topic="${topicId}" data-result="yes">✅ Got it!</button>
          <button class="tiny-button assess" data-topic="${topicId}" data-result="no">🤔 Need more practice</button>
        </div>
      </div>
    `;
  }

  function renderModelRows(topic) {
    if (!topic.modelRows) return "";
    return `
      <div class="card">
        <h3 class="section-title">Model Table</h3>
        <div class="progress-table">
          ${topic.modelRows.map((row) => `
            <div class="progress-row">
              <strong>${escapeHtml(row[0])}</strong>
              <span>${math(row[1])}</span>
              <span class="muted">${escapeHtml(row[2])}</span>
              <span></span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function topicCoachLine(topic) {
    const lines = {
      "integration-by-parts": "Think of it like teamwork: one part gets simpler, the other part gets integrated. You're just splitting the work.",
      "trig-integrals": "Don't panic at the trig functions. They're just numbers in disguise. Use the identities to unmask them.",
      "trig-substitution": "The square root is hiding something simple. Match its shape to the right triangle, and it all simplifies.",
      "partial-fractions": "Break that big scary fraction into bite-sized pieces. Each piece becomes easy log or arctan.",
      "ode-separable": "Imagine sorting: all the y-stuff goes with dy, all the x-stuff goes with dx. Then just integrate both sides.",
      "ode-linear": "There's a magic multiplier (integrating factor) that makes everything click into place. Find it, use it.",
      "ode-linear-models": "This is math telling real stories. Growth means things multiply. Cooling means things balance out.",
      "partial-derivatives": "Pretend all other variables are frozen constants. Differentiate just one variable at a time.",
      "chain-rule": "Trace all the connections: how does changing one thing affect another? Add up all the paths."
    };
    return lines[topic.id] || "Take a breath. Find the first simple step. Then do the next one. You've got this.";
  }

  function renderTopic(topic) {
    window.ODEProgress.visitTopic(state, topic.id);
    state = window.ODEProgress.load();
    if (!location.hash || location.hash === "#/") {
      els.hero.classList.remove("hidden");
    } else {
      els.hero.classList.add("hidden");
    }
    els.topbarTitle.textContent = `${topic.number} ${topic.title}`;
    renderReviewBanner(topic);
    const examples = topic.examples || [];
    const practice = topic.practice || [];
    const firstExample = examples[0];
    const remainingExamples = examples.slice(1);
    const firstPractice = practice[0];
    const remainingPractice = practice.slice(1);

    const topicForMid = isForMid(topic.id);
    els.content.innerHTML = `
      ${topicForMid ? `<div class="mid-topic-banner">${midBadge()} This chapter is on the midterm (${escapeHtml(midterm.label)}). Focus here.</div>` : ''}
      <article class="card">
        <div class="topic-header">
          <div>
            <span class="eyebrow">${escapeHtml(topic.moduleTitle)}${topicForMid ? ' ' + midBadge() : ''}</span>
            <h2 class="topic-title">${topic.number} ${escapeHtml(topic.title)}</h2>
            <p class="prose">${escapeHtml(topic.hook)}</p>
            <div class="tag-row">
              ${(topic.prerequisites || []).map((item) => `<span class="tag">Uses: ${escapeHtml(item)}</span>`).join("")}
            </div>
          </div>
          <div class="pill-row">
            <label class="checkbox-label"><input type="checkbox" data-check="theory" ${state.checks[topic.id]?.theory ? "checked" : ""}> I read this</label>
            <label class="checkbox-label"><input type="checkbox" data-check="examples" ${state.checks[topic.id]?.examples ? "checked" : ""}> I watched examples</label>
            <label class="checkbox-label"><input type="checkbox" data-check="practice" ${state.checks[topic.id]?.practice ? "checked" : ""}> I tried practice</label>
          </div>
        </div>
        ${formulaList(topic)}
      </article>

      <section class="split">
        <div class="card">
          <h3 class="section-title">Tiny Idea</h3>
          <div class="prose">
            <p class="coach-note">${escapeHtml(topicCoachLine(topic))}</p>
            ${(topic.theory || []).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
          </div>
        </div>
        <div class="card">
          <h3 class="section-title">Your Mission (if you choose to accept it)</h3>
          <p class="prose">Don't worry about mastering this yet. Just copy one key formula on paper, then try the first practice problem. Even if you get stuck, you're building muscle memory! 💪</p>
          <div class="feynman-box">
            <strong>Explain it simply:</strong>
            <p>Can you describe this method in one sentence? What's the main idea, and when would you use it?</p>
          </div>
        </div>
      </section>

      ${firstExample ? `
      <section class="card study-stage">
        <span class="eyebrow">Step 1: Watch & Learn 👀</span>
        <h3 class="section-title">See how it's done</h3>
        <p class="prose">Click through the steps slowly. Notice the first move - that's usually the key! Don't rush; understanding one example well beats memorizing ten badly.</p>
        <div class="content-grid">
          ${exampleCard(firstExample, 0, topic.id)}
        </div>
      </section>
      ` : ""}

      ${firstPractice ? `
      <section class="card study-stage">
        <span class="eyebrow">Step 2: Your Turn ✏️</span>
        <h3 class="section-title">Try it yourself</h3>
        <p class="prose">Grab paper and write just one line. Even if you're not sure, trying builds confidence. The hint is there if you need it - no shame in that!</p>
        <div class="content-grid">
          ${practiceCard(firstPractice, topic.id, 0)}
        </div>
      </section>
      ` : ""}

      ${remainingExamples.length ? `
      <section class="card study-stage">
        <span class="eyebrow">Step 3: Pattern Recognition 🔍</span>
        <h3 class="section-title">More examples to explore</h3>
        <p class="prose">Each example shows a different flavor of the same technique. Look for what stays the same and what changes.</p>
        <div class="content-grid">
          ${remainingExamples.map((example, index) => exampleCard(example, index + 1, topic.id)).join("")}
        </div>
      </section>
      ` : ""}

      ${remainingPractice.length ? `
      <section class="card study-stage">
        <span class="eyebrow">Step 4: Build Confidence 🚀</span>
        <h3 class="section-title">More practice problems</h3>
        <p class="prose">The more you try, the easier it gets. You're training your math muscles!</p>
        <div class="content-grid">
          ${remainingPractice.map((item, index) => practiceCard(item, topic.id, index + 1)).join("")}
        </div>
      </section>
      ` : ""}

      ${renderModelRows(topic)}

      <section class="card">
        <h3 class="section-title">Quick Recap 📝</h3>
        <div class="prose">
          <p><strong>Before you move on, remember these key points:</strong></p>
          <ul>
            ${(topic.recap || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
          </ul>
          <p style="margin-top: 20px; color: var(--success); font-weight: 600;">Great job working through this topic! You're making progress. 🎉</p>
        </div>
        <div class="button-row">
          <button class="primary-button" id="nextTopic">Ready for the next lesson →</button>
          <button class="ghost-button" data-route="mixed">Practice mixed problems</button>
        </div>
      </section>
    `;

    bindTopicInteractions(topic);
    renderNav();
    updateActiveNav();
    updateProgressUI();
    renderMath(document.body);
  }

  function bindStepButtons(scope) {
    scope.querySelectorAll(".example-card, .solution-box").forEach((card) => {
      const steps = [...card.querySelectorAll(".step")];
      const next = card.querySelector(".reveal-next");
      const all = card.querySelector(".reveal-all");
      const reset = card.querySelector(".reset-steps");

      if (next) {
        next.addEventListener("click", () => revealNextIn(card));
      }
      if (all) {
        all.addEventListener("click", () => steps.forEach((item) => item.classList.add("visible")));
      }
      if (reset) {
        reset.addEventListener("click", () => steps.forEach((item, index) => item.classList.toggle("visible", index === 0)));
      }
    });
  }

  function revealNextIn(scope) {
    const hidden = [...scope.querySelectorAll(".step:not(.visible)")][0];
    if (hidden) hidden.classList.add("visible");
  }

  function bindTopicInteractions(topic) {
    els.content.querySelectorAll("[data-check]").forEach((input) => {
      input.addEventListener("change", () => {
        window.ODEProgress.setCheck(state, topic.id, input.dataset.check, input.checked);
        state = window.ODEProgress.load();
        
        // Celebrate when all checkboxes are checked!
        const checks = state.checks[topic.id] || {};
        if (checks.theory && checks.examples && checks.practice) {
          // Show a friendly celebration message
          const celebration = document.createElement("div");
          celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--teal), var(--success));
            color: #06120f;
            padding: 24px 32px;
            border-radius: 20px;
            font-size: 1.2rem;
            font-weight: 800;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            z-index: 10000;
            animation: celebrate 0.5s ease;
          `;
          celebration.textContent = `🎉 Topic Complete! You're doing great!`;
          document.body.appendChild(celebration);
          setTimeout(() => celebration.remove(), 2000);
        }
        
        renderNav();
        updateActiveNav();
        updateProgressUI();
      });
    });

    els.content.querySelectorAll(".show-hint").forEach((button) => {
      button.addEventListener("click", () => button.closest(".practice-card").querySelector(".hint-box").classList.remove("hidden"));
    });

    els.content.querySelectorAll(".show-solution").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".practice-card");
        card.querySelector(".solution-box").classList.remove("hidden");
        card.querySelector(".self-assess").classList.remove("hidden");
        renderMath(card);
      });
    });

    els.content.querySelectorAll(".assess").forEach((button) => {
      button.addEventListener("click", () => {
        window.ODEProgress.recordPractice(state, button.dataset.topic, button.dataset.result);
        state = window.ODEProgress.load();
        const message = button.dataset.result === "yes" 
          ? `<span class="tag" style="background: var(--success); color: #06120f;">✅ Awesome! Keep going!</span>`
          : `<span class="tag" style="background: var(--warning); color: #06120f;">📚 That's okay! Practice makes progress!</span>`;
        button.closest(".self-assess").innerHTML = message;
      });
    });

    const next = document.getElementById("nextTopic");
    if (next) {
      next.addEventListener("click", () => {
        const index = topics.findIndex((item) => item.id === topic.id);
        setRoute(topics[(index + 1) % topics.length].id);
      });
    }

    bindStepButtons(els.content);
  }

  function renderFormulas() {
    els.hero.classList.add("hidden");
    els.reviewBanner.classList.add("hidden");
    els.topbarTitle.textContent = "Formula Sheet";
    els.content.innerHTML = `
      <section class="card">
        <span class="eyebrow">Your Formula Cheat Sheet 📋</span>
        <h2 class="topic-title">Essential Formulas for the Midterm</h2>
        <p class="prose">Don't try to memorize everything at once! Hide the formulas, try writing them from memory, then reveal to check. Repeat this a few times and they'll stick. 🧠</p>
        <div class="button-row">
          <button class="primary-button" id="hideAllFormulas">🙈 Hide all</button>
          <button class="ghost-button" id="showAllFormulas">👀 Show all</button>
          <button class="ghost-button" onclick="window.print()">🖨️ Print sheet</button>
        </div>
      </section>
      <section class="formula-grid">
        ${course.formulas.map((item, index) => `
          <article class="formula-card">
            <span class="eyebrow">${escapeHtml(item.priority)} ${item.priority === "Must Memorize" ? "⭐" : "💡"}</span>
            <h3>${escapeHtml(item.topic)}</h3>
            <p class="muted">${escapeHtml(item.module)}</p>
            <div class="formula-body">${math(item.formula, true)}</div>
            <button class="tiny-button toggle-formula" data-index="${index}">👁️ Hide/reveal</button>
          </article>
        `).join("")}
      </section>
    `;
    document.querySelectorAll(".toggle-formula").forEach((button) => {
      button.addEventListener("click", () => button.closest(".formula-card").classList.toggle("concealed"));
    });
    document.getElementById("hideAllFormulas").addEventListener("click", () => {
      document.querySelectorAll(".formula-card").forEach((card) => card.classList.add("concealed"));
    });
    document.getElementById("showAllFormulas").addEventListener("click", () => {
      document.querySelectorAll(".formula-card").forEach((card) => card.classList.remove("concealed"));
    });
    updateActiveNav();
    renderMath(document.body);
  }

  function renderMixedPractice() {
    els.hero.classList.add("hidden");
    els.reviewBanner.classList.add("hidden");
    els.topbarTitle.textContent = "Mixed Practice";
    const session = window.ODEPractice.createPracticeSession(course.mixedPractice);
    const methods = [...new Set(course.mixedPractice.map((item) => item.method))].sort();

    function draw() {
      const item = session.current();
      els.content.innerHTML = `
        <section class="card mixed-stage">
          <span class="eyebrow">Exam-Style Practice 🎯</span>
          <h2 class="topic-title">Mixed Problems</h2>
          <p class="prose">This is like the real exam: you see a problem and first figure out <em>which method</em> to use. Take your time, there's no rush! 😊</p>
          <p class="prose"><strong>Problem:</strong> ${math(item.problem)}</p>
          <p class="prose" style="color: var(--teal); font-weight: 600;">👉 Which method would you use?</p>
          <div class="method-options">
            ${methods.map((method) => `<button class="method-option" data-method="${escapeHtml(method)}">${escapeHtml(method)}</button>`).join("")}
          </div>
          <div id="methodFeedback" class="hint-box hidden"></div>
          <div class="button-row">
            <button class="ghost-button" id="mixedHint">💡 Give me a hint</button>
            <button class="primary-button" id="mixedSolution">👀 Show solution</button>
            <button class="ghost-button" id="mixedNext">➡️ Next problem</button>
          </div>
          <div id="mixedHintBox" class="hint-box hidden"><strong>Hint:</strong> ${escapeHtml(item.hint)}</div>
          <div id="mixedSolutionBox" class="solution-box hidden">${stepsHtml(item.steps)}</div>
          <p class="muted">Your score: ${state.mixed.correct}/${state.mixed.attempts} correct ${state.mixed.attempts > 0 ? `(${Math.round(state.mixed.correct/state.mixed.attempts*100)}%)` : ''}</p>
        </section>
      `;

      els.content.querySelectorAll(".method-option").forEach((button) => {
        button.addEventListener("click", () => {
          if (session.hasAnswered()) return;
          const isCorrect = button.dataset.method === item.method;
          button.classList.add(isCorrect ? "correct" : "incorrect");
          els.content.querySelectorAll(".method-option").forEach((option) => {
            if (option.dataset.method === item.method) option.classList.add("correct");
          });
          const feedback = document.getElementById("methodFeedback");
          feedback.classList.remove("hidden");
          feedback.innerHTML = isCorrect 
            ? `<strong style="color: var(--success);">✅ Correct!</strong> You've got the right method. Now try solving it on paper!` 
            : `<strong style="color: var(--warning);">🤔 Not quite.</strong> The right method here is <strong>${item.method}</strong>. Take a moment to see why - what clue did you miss?`;
          window.ODEProgress.recordMixed(state, isCorrect);
          state = window.ODEProgress.load();
          session.markAnswered();
        });
      });

      document.getElementById("mixedHint").addEventListener("click", () => document.getElementById("mixedHintBox").classList.remove("hidden"));
      document.getElementById("mixedSolution").addEventListener("click", () => {
        document.getElementById("mixedSolutionBox").classList.remove("hidden");
        renderMath(els.content);
      });
      document.getElementById("mixedNext").addEventListener("click", () => {
        session.next();
        draw();
        renderMath(els.content);
      });

      renderMath(els.content);
    }

    draw();
    updateActiveNav();
  }

  function renderExamSprint() {
    els.hero.classList.add("hidden");
    els.reviewBanner.classList.add("hidden");
    els.topbarTitle.textContent = "Midterm Sprint";

    /* Use midterm sprint when available, fall back to general sprint */
    const sprintData = course.midtermSprint || course.examSprint;
    const sprintLabel = course.midtermSprint ? '7-Day Midterm Sprint' : '7-Day Exam Sprint';
    const sprintDesc = course.midtermSprint
      ? `Your focused 7-day plan for the midterm (${escapeHtml(midterm.label)}). <strong>Don't panic!</strong> This covers exactly what you need: <strong>Calculus Ch 7 (Integration), Ch 13 (Partials & Chain Rule), and DE §2.2, §2.3, §3.1</strong>. Take it one day at a time, and you'll be ready! 💪`
      : 'A structured 7-day study plan. Follow one day at a time, write the checkpoint on paper, and use mixed practice to find weak spots. You\'ve got this!';

    els.content.innerHTML = `
      <section class="card sprint-hero">
        <span class="eyebrow">Your Week-Long Game Plan ${course.midtermSprint ? ' ' + midBadge() : ''}  🎯</span>
        <h2 class="topic-title">${sprintLabel}</h2>
        <p class="prose">${sprintDesc}</p>
        <div class="prose" style="margin-top: 20px; padding: 16px; background: rgba(78, 230, 202, 0.1); border-radius: 16px; border: 2px solid rgba(78, 230, 202, 0.25);">
          <strong style="color: var(--teal);">💡 Friendly Tip:</strong> Don't try to be perfect. Just follow each day's plan, do your best, and trust the process. Even 70% effort on all 7 days beats 100% effort on only 3 days!
        </div>
      </section>
      <section class="sprint-grid">
        ${sprintData.map((day) => `
          <article class="card sprint-card for-mid">
            <div class="sprint-card-header">
              <span class="sprint-day">Day ${day.day} ${day.day === 7 ? '🏁' : day.day === 1 ? '🚀' : '📚'}</span>
              <span class="tag">${escapeHtml(day.timeBox)}</span>
            </div>
            <h3>${escapeHtml(day.title)}</h3>
            <p class="prose" style="color: var(--teal); font-weight: 600;">${escapeHtml(day.why)}</p>
            <ol class="sprint-task-list">
              ${day.tasks.map((task) => `<li>${escapeHtml(task)}</li>`).join("")}
            </ol>
            <div class="feynman-box sprint-checkpoint">
              <strong>✅ Today's checkpoint:</strong>
              <p>${escapeHtml(day.checkpoint)}</p>
            </div>
            <div class="tag-row sprint-route-row">
              ${day.routes.map((route) => `<button class="tiny-button" data-route="${escapeHtml(route.id)}">${escapeHtml(route.label)}</button>`).join("")}
            </div>
          </article>
        `).join("")}
      </section>
    `;

    bindRouteButtons(els.content);
    updateActiveNav();
  }

  function renderProgress() {
    els.hero.classList.add("hidden");
    els.reviewBanner.classList.add("hidden");
    els.topbarTitle.textContent = "Progress Tracker";
    els.content.innerHTML = `
      <section class="card">
        <span class="eyebrow">Local only</span>
        <h2 class="topic-title">Progress Tracker</h2>
        <p class="prose">Saved in localStorage on this browser. Use the checkboxes as a lightweight study log, not as a grade.</p>
      </section>
      <section class="card progress-table">
        ${topics.map((topic) => {
          const checks = state.checks[topic.id] || {};
          return `
            <div class="progress-row">
              <strong>${topic.number} ${escapeHtml(topic.title)}</strong>
              <label class="checkbox-label"><input type="checkbox" data-topic="${topic.id}" data-check="theory" ${checks.theory ? "checked" : ""}> Theory</label>
              <label class="checkbox-label"><input type="checkbox" data-topic="${topic.id}" data-check="examples" ${checks.examples ? "checked" : ""}> Examples</label>
              <label class="checkbox-label"><input type="checkbox" data-topic="${topic.id}" data-check="practice" ${checks.practice ? "checked" : ""}> Practice</label>
            </div>
          `;
        }).join("")}
      </section>
    `;
    els.content.querySelectorAll("[data-topic][data-check]").forEach((input) => {
      input.addEventListener("change", () => {
        window.ODEProgress.setCheck(state, input.dataset.topic, input.dataset.check, input.checked);
        state = window.ODEProgress.load();
        renderNav();
        updateProgressUI();
      });
    });
    updateActiveNav();
  }

  function renderDecisionTreePage() {
    els.hero.classList.add("hidden");
    els.reviewBanner.classList.add("hidden");
    els.topbarTitle.textContent = "ODE Decision Tree";
    window.ODEDecisionTree.renderDecisionTree(els.content);
    updateActiveNav();
    renderMath(document.body);
  }

  function renderRoute() {
    const current = route();
    const topic = topics.find((item) => item.id === current);
    if (topic) renderTopic(topic);
    if (current === "formulas") renderFormulas();
    if (current === "exam-sprint") renderExamSprint();
    if (current === "mixed") renderMixedPractice();
    if (current === "progress") renderProgress();
    if (current === "decision-tree") renderDecisionTreePage();
    updateProgressUI();
  }

  function bindGlobal() {
    const brand = document.querySelector(".brand");
    if (brand) {
      brand.style.cursor = "pointer";
      brand.addEventListener("click", () => {
        setRoute("");
      });
    }

    document.getElementById("menuToggle").addEventListener("click", () => {
      els.sidebar.classList.toggle("open");
    });

    document.getElementById("themeToggle").addEventListener("click", () => {
      document.body.classList.toggle("light");
      state.theme = document.body.classList.contains("light") ? "light" : "dark";
      window.ODEProgress.save(state);
    });

    document.addEventListener("keydown", (event) => {
      if (event.target.matches("textarea,input")) return;
      const currentIndex = topics.findIndex((item) => item.id === route());
      if (event.key === "ArrowRight" && currentIndex >= 0) {
        setRoute(topics[(currentIndex + 1) % topics.length].id);
      }
      if (event.key === "ArrowLeft" && currentIndex >= 0) {
        setRoute(topics[(currentIndex - 1 + topics.length) % topics.length].id);
      }
      if (event.key === " ") {
        event.preventDefault();
        const openCard = document.querySelector(".example-card[open]");
        if (openCard) revealNextIn(openCard);
      }
      if (event.key === "Escape") {
        els.sidebar.classList.remove("open");
      }
    });

    window.addEventListener("hashchange", renderRoute);
  }

  function init() {
    if (state.theme === "light") document.body.classList.add("light");
    window.ODEProgress.visitTopic(state, route());
    state = window.ODEProgress.load();
    renderNav();
    bindGlobal();
    renderRoute();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
