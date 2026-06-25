# Chapters 1–2 ODE Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the ODE foundations, models, IVPs, and first-order solution methods faithful, mathematically verified, and teachable without hidden prerequisite gaps.

**Architecture:** Complete page-level audit records for both PDFs, add a dedicated structured regression suite, then correct source defects and strengthen interval/model/method explanations in the existing course data. Keep the primary path compact by emphasizing the solved and assigned patterns printed in the supplied notes.

**Tech Stack:** Vanilla JavaScript, Node.js, JSON audit artifacts, KaTeX, browser verification.

---

## Task 1: Complete the 41-Page ODE Audit Ledger

**Files:**
- Modify: `tests/audit-ledger.mjs`
- Modify: `scripts/create-pdf-ledger.mjs`
- Regenerate: `audit/pdf-ledger.json`

1. Add failing assertions requiring every Chapter 1 and Chapter 2 page to have
   `reviewed` or `issue` status, a page summary, and a course decision.
2. Mark these Chapter 1 source issues explicitly:
   - page 1: interval printed as `(∞,∞)` instead of `(-∞,∞)`;
   - page 5: Exercise 11's proposed solution does not solve the printed ODE;
   - page 23: inconsistent falling-body coordinate signs and a missing factor of
     `t` in the displayed position formula.
3. Record that Chapter 1 page 26 lists external Zill exercise numbers without
   reproducing their problem statements; cover model patterns rather than inventing
   those exercises.
4. Record all 15 Chapter 2 pages, including the exact printed solved exercises.
5. Regenerate the ledger and run `node tests/audit-ledger.mjs`.

## Task 2: Structured ODE Regression Suite

**Files:**
- Create: `tests/chapters-1-2.mjs`
- Modify: `package.json`

The failing suite will assert:

- all Chapter 1 and Chapter 2 worked examples carry page-level provenance;
- Exercise 1.1 #11 is typed `corrected-pdf-error`;
- IVP Exercises 1.2 #3 and #4 include maximal intervals;
- the falling-body model declares a coordinate convention;
- all ten printed model families remain represented;
- Exercise 2.2 #25 includes interval `(-∞,0)`;
- Exercise 2.3 #9 states the interval convention used for `1/x`;
- exact equations include an on-page partial-derivative mini-review instead of
  depending on a later module;
- Exercises 2.4 #3/#33 and 2.5 #15/#18 preserve their printed equations and verified
  results.

Add `node tests/chapters-1-2.mjs` to `npm test`, run it, and confirm RED before
editing production content.

## Task 3: Correct and Strengthen ODE Content

**Files:**
- Modify: `js/content.js`
- Modify: `audit/source-issues.md`

1. Add provenance to all Chapter 1 and Chapter 2 PDF-derived examples and selected
   exercises.
2. Upgrade Exercise 1.1 #11's provenance to `corrected-pdf-error`.
3. Add provenance to all four printed IVP exercises and retain maximal intervals.
4. Add `I=(-∞,0)` to separable Exercise 2.2 #25.
5. Clarify Exercise 2.3 #9:
   - the PDF works on `(0,∞)`;
   - `1/x` is a valid integrating factor on either interval not crossing zero,
     up to a nonzero constant multiple.
6. Add an exact-equation mini-review explaining `M_y` and `N_x` before using them.
7. Teach falling bodies with one declared convention:
   - upward-positive height: `mh'' + kh' = -mg`;
   - no drag: `h=h₀+v₀t−gt²/2`;
   - explain that the PDF mixes this with a downward-positive equation.
8. Enrich the model section with compact verified cards for:
   - Malthus and logistic growth;
   - decay/cooling;
   - disease/reaction;
   - mixing;
   - RLC and mechanical motion.
9. Keep model exercises as recognition/setup tasks because the PDF references
   external textbook exercise numbers without printing their statements.

## Task 4: Independent ODE Mathematics Checks

**Files:**
- Modify: `tests/math-verification.mjs`
- Modify: `tests/chapters-1-2.mjs`

Add numerical or direct residual checks for:

- Chapter 1 Examples 1(a), 1(b), 2, and 3;
- IVP Exercises #3, #4, #7, and #8;
- separable Exercises #23 and #25;
- linear Exercises #3, #9, and #27;
- exact potentials for Exercises #3 and #33;
- Bernoulli Exercises #15 and #18;
- Malthus/logistic equilibria;
- the corrected upward-positive falling-body formula.

Run `npm test`; all suites must pass.

## Task 5: Browser Verification

1. Open Module 2 and Module 3 topics in the local app.
2. Confirm corrected-source warnings render for Exercise 11 and falling bodies.
3. Confirm interval notes and exact-equation prerequisite explanation are visible.
4. Reveal steps and solutions for one IVP, one separable, one linear, one exact, and
   one Bernoulli item.
5. Check desktop/mobile widths and the browser console.

## Completion Evidence

- 26 Chapter 1 and 15 Chapter 2 pages reviewed with no pending records;
- every printed solved example independently checked;
- all source errors disclosed and corrected;
- first-order method recognition and interval handling strengthened;
- all automated suites and browser flows passing.

