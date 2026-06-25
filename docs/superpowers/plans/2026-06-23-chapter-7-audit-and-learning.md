# Chapter 7 Audit and Learning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Chapter 7 mathematically verified, faithful to the rendered PDF, and strong enough to rebuild the integration skills required for the ODE exam.

**Architecture:** Record all 30 rendered pages in the audit ledger, add structured regressions around each distinct worked-example pattern, then improve only the practice needed for one-week mastery. Preserve the existing app architecture during this content phase while exposing source anomalies directly in worked-example cards.

**Tech Stack:** Vanilla JavaScript, Node.js tests, JSON audit records, KaTeX, HTML/CSS.

---

## High-Yield Coverage Standard

The primary path will include:

- every Chapter 7 worked example;
- the three decision families for sine/cosine powers;
- the three decision families for tangent/secant powers;
- product-to-sum recognition;
- all three radical shapes for trigonometric substitution;
- the explicitly assigned arc-length Exercises 7.4 #33 and #34;
- distinct, repeated, irreducible-quadratic, and improper partial fractions;
- independent differentiation or numerical checks for representative answers.

The app will not reproduce all 82 exercise-set prompts. It will select enough
problems to cover every distinct recognition and algebra pattern.

## Task 1: Complete the 30-Page Chapter 7 Ledger

**Files:**
- Modify: `tests/audit-ledger.mjs`
- Modify: `scripts/create-pdf-ledger.mjs`
- Regenerate: `audit/pdf-ledger.json`

1. Add a failing assertion that all 30 Chapter 7 page records have status
   `reviewed` or `issue`, a page-specific summary, and a course decision.
2. Run `node tests/audit-ledger.mjs`; expect failure on pending Chapter 7 pages.
3. Add the visual page map to the generator:
   - pages 1–8: integration by parts, reduction formulas, exercises;
   - pages 9–18: trigonometric identities, examples, and exercises;
   - pages 19–26: trigonometric substitution, examples, assignments, exercises;
   - pages 26–30: partial fractions, examples, and exercises.
4. Mark page 5 `issue` because the solution inserts bounds absent from the printed
   Example 6 prompt.
5. Mark page 24 `issue` because the PDF repeats the label “Example 5.”
6. Regenerate the ledger and rerun the ledger test.

## Task 2: Chapter 7 Regression Tests

**Files:**
- Create: `tests/chapter-7.mjs`
- Modify: `package.json`

1. Add failing structured assertions for:
   - all PDF worked-example titles/problems;
   - Example 6's printed indefinite problem and source inconsistency note;
   - exactly one secant-cubed formula step in the arc-length example;
   - Exercises 7.4 #33 and #34 in practice with PDF provenance;
   - practice coverage for sine/cosine odd/even recognition;
   - practice coverage for tangent/secant recognition;
   - practice coverage for all four partial-fraction denominator types.
2. Add `node tests/chapter-7.mjs` to `npm test`.
3. Run the test and confirm it fails on the missing assignments and duplicate step.

## Task 3: Correct and Enrich Chapter 7 Content

**Files:**
- Modify: `js/content.js`
- Modify: `js/app.js`
- Modify: `css/style.css`
- Modify: `audit/source-issues.md`

1. Add complete provenance to all Chapter 7 PDF worked examples.
2. Add a source note to Example 6:
   - printed prompt: indefinite integral;
   - printed solution: silently evaluates from 0 to 1;
   - primary teaching answer: indefinite antiderivative;
   - note the definite variant equals `π/4 - 1/2 ln 2`.
3. Remove the duplicate secant-cubed formula step from Example 7.4 #4.
4. Add assigned Exercise 7.4 #33:
   - `y = ln x`, `1 ≤ x ≤ 2`;
   - setup `L = ∫₁² √(x²+1)/x dx`;
   - exact result
     `√5 - √2 + ln(2(√2+1)/(√5+1))`.
5. Add assigned Exercise 7.4 #34:
   - `y = x²`, `0 ≤ x ≤ 1`;
   - setup `L = ∫₀¹ √(1+4x²) dx`;
   - exact result `√5/2 + 1/4 ln(2+√5)`.
6. Expand practice sparingly:
   - one repeated-by-parts problem;
   - one inverse-trigonometric by-parts problem;
   - one tangent/secant recognition problem;
   - one repeated-factor partial fraction;
   - one irreducible-quadratic partial fraction.
7. Render provenance notes as a compact source-warning callout in worked and
   practice cards.

## Task 4: Independent Chapter 7 Mathematics Checks

**Files:**
- Modify: `tests/math-verification.mjs`
- Modify: `tests/chapter-7.mjs`

1. Numerically differentiate representative antiderivatives from sections
   7.2–7.5 at safe domain points.
2. Verify the partial-fraction decompositions by reconstructing their original
   rational functions.
3. Numerically compare both assigned arc-length exact values with numerical
   integration.
4. Verify the Example 6 definite variant independently.
5. Run `npm test`; require all suites to pass.

## Task 5: Browser Verification

**Files:**
- Verify: `index.html`
- Verify: `js/app.js`
- Verify: `css/style.css`

1. Start `python3 -m http.server 5173`.
2. Open each Chapter 7 topic.
3. Confirm KaTeX renders all corrected expressions.
4. Confirm source notes are visible but not visually dominant.
5. Confirm step reveal/reset and practice hint/solution controls work.
6. Check desktop and mobile widths.
7. Confirm no console errors or warnings.

## Completion Evidence

- all 30 Chapter 7 ledger pages reviewed;
- every Chapter 7 worked example mapped and recalculated;
- explicit PDF anomalies documented;
- assigned Exercises #33–34 available with verified solutions;
- every distinct integration-method pattern represented in practice;
- all automated checks passing;
- Chapter 7 browser flows verified.

