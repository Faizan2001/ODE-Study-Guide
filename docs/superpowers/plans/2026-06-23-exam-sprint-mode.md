# Exam Sprint Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compact seven-day exam sprint route that tells the student exactly what to study while preserving the full audited course.

**Architecture:** Store the sprint schedule as data on `window.ODE_COURSE` in `js/content.js`, then render it from `js/app.js` using existing route chips and styles. Add a focused Node regression test plus browser verification so the sprint remains short, high-yield, and navigable.

**Tech Stack:** Vanilla JavaScript, static HTML/CSS, Node.js assertion tests, Playwright CLI for browser checks.

---

### Task 1: Add sprint regression tests

**Files:**
- Create: `tests/exam-sprint.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing test**

Create a test that loads `js/content.js` and asserts:

- `course.examSprint` is an array of exactly seven days;
- every day has a day number, title, time box, why text, tasks, route chips, and checkpoint;
- every day has no more than six tasks;
- route chips point to existing topic ids or allowed utility routes;
- the schedule includes required routes: `calc-integration`, `integration-by-parts`, `trig-integrals`, `trig-substitution`, `partial-fractions`, `ode-separable`, `ode-linear`, `ode-exact`, `ode-bernoulli`, `partial-derivatives`, `directional-gradients`, `tangent-planes`, `maxima-minima`, `mixed`, `formulas`, and `decision-tree`;
- at least four days include paper-first work;
- at least three days include mixed-practice work.

- [ ] **Step 2: Run RED**

Run: `node tests/exam-sprint.mjs`

Expected: fail because `course.examSprint` does not exist.

### Task 2: Add sprint data

**Files:**
- Modify: `js/content.js`

- [ ] **Step 1: Define `examSprint`**

Add a seven-day array near the derived `formulas`/`mixedPractice` data.

- [ ] **Step 2: Export it**

Include `examSprint` in `window.ODE_COURSE`.

- [ ] **Step 3: Run GREEN for data**

Run: `node tests/exam-sprint.mjs`

Expected: pass.

### Task 3: Render the route

**Files:**
- Modify: `index.html`
- Modify: `js/app.js`
- Modify: `css/style.css`

- [ ] **Step 1: Add sidebar utility link**

Add a `data-route="exam-sprint"` button labelled `Exam Sprint`.

- [ ] **Step 2: Add `renderExamSprint()`**

Render the seven-day cards with time boxes, tasks, checkpoints, and route chips.

- [ ] **Step 3: Wire route dispatch**

In `renderRoute()`, call `renderExamSprint()` when the route is `exam-sprint`.

- [ ] **Step 4: Add small CSS**

Use existing card visual language with a responsive sprint grid and compact task lists.

- [ ] **Step 5: Run full tests**

Run: `npm test`

Expected: all tests pass.

### Task 4: Browser verify

**Files:**
- Modify only if defects are reproduced.

- [ ] **Step 1: Open route**

Use Playwright CLI to open `http://localhost:5173/#exam-sprint`.

- [ ] **Step 2: Verify desktop/mobile**

Check that cards render, route buttons navigate, console has zero errors/warnings, and mobile width has no horizontal overflow.

- [ ] **Step 3: Final verification**

Run: `npm test`

Expected: all checks pass.

