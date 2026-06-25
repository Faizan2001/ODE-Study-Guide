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
          <span class="tag">open steps</span>
        </summary>
        <p class="prose"><strong>Problem:</strong> ${math(example.problem)}</p>
        ${provenanceHtml(example)}
        ${stepsHtml(example.steps)}
        <div class="button-row">
          <button class="primary-button reveal-next">Show next tiny step</button>
          <button class="ghost-button reveal-all">Show whole solution</button>
          <button class="ghost-button reset-steps">Reset</button>
        </div>
        <p class="takeaway">${escapeHtml(example.takeaway || "")}</p>
      </details>
    `;
  }

  function practiceCard(item, topicId, index) {
    const forMid = isForMid(topicId) || isExampleForMid(item);
    return `
      <div class="practice-card${forMid ? ' for-mid' : ''}">
        <span class="eyebrow">Active recall ${index + 1}${forMid ? ' ' + midBadge() : ''}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="prose"><strong>Try this on paper first:</strong> ${math(item.problem)}</p>
        ${provenanceHtml(item)}
        <textarea placeholder="Optional: write the first line you would put in your notebook."></textarea>
        <div class="button-row">
          <button class="ghost-button show-hint">Need a nudge</button>
          <button class="primary-button show-solution">Show worked answer</button>
        </div>
        <div class="hint-box hidden">${escapeHtml(item.hint)}</div>
        <div class="solution-box hidden">${stepsHtml(item.steps)}</div>
        <div class="button-row hidden self-assess">
          <span class="tag">Did your paper answer match?</span>
          <button class="tiny-button assess" data-topic="${topicId}" data-result="yes">Yes</button>
          <button class="tiny-button assess" data-topic="${topicId}" data-result="no">No</button>
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
      "calc-differentiation": "Translation: find the slope machine. Most of the work is spotting which rule is being asked for.",
      "calc-integration": "Translation: undo a derivative. If you can guess what was differentiated, you are already halfway there.",
      "integration-by-parts": "Translation: split the integral into two jobs. Pick the part that gets simpler when differentiated.",
      "trig-integrals": "Translation: do not fight the trig. Use identities to turn the expression into something ordinary.",
      "trig-substitution": "Translation: radicals are wearing disguises. Match the radical shape to the substitution.",
      "partial-fractions": "Translation: break one scary fraction into small fractions that integrate into logs or arctan.",
      "de-terminology": "Translation: learn the labels so the exam question stops sounding like a foreign language.",
      "ivp": "Translation: solve first, then use the starting value to pick the one curve that belongs to the problem.",
      "models": "Translation: turn a story into a rate equation. The story tells you what is growing, leaking, cooling, or moving.",
      "ode-linear-models": "Translation: connect the math to the story. Growth is positive feedback; cooling and circuits are drag forces pushing back.",
      "ode-separable": "Translation: put all y stuff on one side and all x stuff on the other, then integrate.",
      "ode-linear": "Translation: force the equation into standard form, then use the integrating factor as your multiplier.",
      "ode-exact": "Translation: check if the equation secretly came from one hidden function f(x,y).",
      "ode-bernoulli": "Translation: it looks nonlinear, but one substitution turns it into a linear equation.",
      "functions-many-vars": "Translation: one input is not enough anymore. Think of the output as height over a map.",
      "limits-continuity": "Translation: approach the same point from different roads. If the answers disagree, the limit fails.",
      "partial-derivatives": "Translation: freeze everything except one variable, then differentiate like usual.",
      "chain-rule": "Translation: follow every path of influence and add the effects together.",
      "directional-gradients": "Translation: the gradient points uphill. Dot it with a direction to ask, 'how steep this way?'",
      "tangent-planes": "Translation: find the flat sheet that just kisses the surface at one point.",
      "maxima-minima": "Translation: find flat spots, then decide whether each is a bowl, hill, or saddle."
    };
    return lines[topic.id] || "Translation: slow down, find the first move, and do one clean line at a time.";
  }

  function renderTopic(topic) {
    window.ODEProgress.visitTopic(state, topic.id);
    state = window.ODEProgress.load();
    els.hero.classList.remove("hidden");
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
          <h3 class="section-title">Paper Mission</h3>
          <p class="prose">Do not try to love this topic. Just copy one key formula, then attempt the first practice problem before revealing the answer.</p>
          <div class="feynman-box">
            <strong>Say it simply:</strong>
            <p>In one sentence: what is the move here, and how do you recognize when to use it?</p>
          </div>
        </div>
      </section>

      ${firstExample ? `
      <section class="card study-stage">
        <span class="eyebrow">1. Watch one</span>
        <h3 class="section-title">Steal the move</h3>
        <p class="prose">Open the steps slowly. Your job is not to be brilliant yet; your job is to notice the first move.</p>
        <div class="content-grid">
          ${exampleCard(firstExample, 0, topic.id)}
        </div>
      </section>
      ` : ""}

      ${firstPractice ? `
      <section class="card study-stage">
        <span class="eyebrow">2. Try one</span>
        <h3 class="section-title">Your first attempt</h3>
        <p class="prose">Do one line on paper before touching the hint. Even a messy first line counts.</p>
        <div class="content-grid">
          ${practiceCard(firstPractice, topic.id, 0)}
        </div>
      </section>
      ` : ""}

      ${remainingExamples.length ? `
      <section class="card study-stage">
        <span class="eyebrow">3. See the patterns</span>
        <h3 class="section-title">More solved examples</h3>
        <div class="content-grid">
          ${remainingExamples.map((example, index) => exampleCard(example, index + 1, topic.id)).join("")}
        </div>
      </section>
      ` : ""}

      ${remainingPractice.length ? `
      <section class="card study-stage">
        <span class="eyebrow">4. Build confidence</span>
        <h3 class="section-title">More paper practice</h3>
        <div class="content-grid">
          ${remainingPractice.map((item, index) => practiceCard(item, topic.id, index + 1)).join("")}
        </div>
      </section>
      ` : ""}

      ${renderModelRows(topic)}

      <section class="card">
        <h3 class="section-title">Before You Leave</h3>
        <div class="prose">
          <ul>
            ${(topic.recap || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
          </ul>
        </div>
        <div class="button-row">
          <button class="primary-button" id="nextTopic">Next lesson</button>
          <button class="ghost-button" data-route="mixed">Mix it up</button>
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
        button.closest(".self-assess").innerHTML = `<span class="tag">Saved. Use this result to choose what to review later.</span>`;
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
        <span class="eyebrow">Recall first, reveal second</span>
        <h2 class="topic-title">Formula Sheet Builder</h2>
        <p class="prose">Hide formulas, try writing them on paper, then reveal. Print this page when you want a clean exam-review sheet.</p>
        <div class="button-row">
          <button class="primary-button" id="hideAllFormulas">Hide all</button>
          <button class="ghost-button" id="showAllFormulas">Show all</button>
          <button class="ghost-button" onclick="window.print()">Print formulas</button>
        </div>
      </section>
      <section class="formula-grid">
        ${course.formulas.map((item, index) => `
          <article class="formula-card">
            <span class="eyebrow">${escapeHtml(item.priority)}</span>
            <h3>${escapeHtml(item.topic)}</h3>
            <p class="muted">${escapeHtml(item.module)}</p>
            <div class="formula-body">${math(item.formula, true)}</div>
            <button class="tiny-button toggle-formula" data-index="${index}">Hide/reveal</button>
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
          <span class="eyebrow">Interleaved exam mode</span>
          <h2 class="topic-title">Mixed Practice</h2>
          <p class="prose">This is the exam-skill gym: first name the method, then solve on paper, then compare.</p>
          <p class="prose"><strong>Problem:</strong> ${math(item.problem)}</p>
          <div class="method-options">
            ${methods.map((method) => `<button class="method-option" data-method="${escapeHtml(method)}">${escapeHtml(method)}</button>`).join("")}
          </div>
          <div id="methodFeedback" class="hint-box hidden"></div>
          <div class="button-row">
            <button class="ghost-button" id="mixedHint">Need a nudge</button>
            <button class="primary-button" id="mixedSolution">Show worked answer</button>
            <button class="ghost-button" id="mixedNext">Another problem</button>
          </div>
          <div id="mixedHintBox" class="hint-box hidden">${escapeHtml(item.hint)}</div>
          <div id="mixedSolutionBox" class="solution-box hidden">${stepsHtml(item.steps)}</div>
          <p class="muted">Current mixed score: ${state.mixed.correct}/${state.mixed.attempts}</p>
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
          feedback.textContent = isCorrect ? "Yes. That is the method. Now make your notebook do the work." : `Close, but this one is ${item.method}. Pause for ten seconds and ask: what clue did I miss?`;
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
    els.topbarTitle.textContent = "Exam Sprint";

    /* Use midterm sprint when available, fall back to general sprint */
    const sprintData = course.midtermSprint || course.examSprint;
    const sprintLabel = course.midtermSprint ? 'Midterm Sprint' : 'Exam Sprint';
    const sprintDesc = course.midtermSprint
      ? `Focused 7-day sprint for the midterm (${escapeHtml(midterm.label)}). Only covers: <strong>Calculus Ch 7, Ch 13, DE §2.2, §2.3</strong>. Follow the day cards in order, write the checkpoint on paper, and use mixed practice to expose weak spots.`
      : 'Use this when time is short: follow the day cards in order, write the checkpoint on paper, and use mixed practice to expose weak spots. The full course stays available when a day tells you to dive deeper.';

    els.content.innerHTML = `
      <section class="card sprint-hero">
        <span class="eyebrow">One-week exam mode${course.midtermSprint ? ' ' + midBadge() : ''}</span>
        <h2 class="topic-title">${sprintLabel}</h2>
        <p class="prose">${sprintDesc}</p>
      </section>
      <section class="sprint-grid">
        ${sprintData.map((day) => `
          <article class="card sprint-card for-mid">
            <div class="sprint-card-header">
              <span class="sprint-day">Day ${day.day}</span>
              <span class="tag">${escapeHtml(day.timeBox)}</span>
            </div>
            <h3>${escapeHtml(day.title)}</h3>
            <p class="prose">${escapeHtml(day.why)}</p>
            <ol class="sprint-task-list">
              ${day.tasks.map((task) => `<li>${escapeHtml(task)}</li>`).join("")}
            </ol>
            <div class="feynman-box sprint-checkpoint">
              <strong>Paper checkpoint:</strong>
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
