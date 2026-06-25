# ODE Study App Readiness Audit

Date: 2026-06-24

## Objective audited

Turn the interactive ODE study app into a trustworthy, engaging primary exam-preparation resource by:

- skeptically auditing all four supplied PDFs page by page;
- correcting source-fidelity and mathematical errors;
- adding regression tests;
- improving study flow and usability;
- verifying the desktop app in real browser use.

## Evidence checked

### PDF/page audit evidence

- `audit/pdf-ledger.json` contains page records for all 126 pages across:
  - `Chapter 7.pdf` (30 pages)
  - `Chapter 13.pdf` (55 pages)
  - `Chapter 01_ODE_new02.pdf` (26 pages)
  - `Chapter 02_ODE04.pdf` (15 pages)
- `tests/audit-ledger.mjs` enforces that every page is either `reviewed` or `issue`, with page-specific summaries, course decisions, and evidence.

Current ledger totals:

- Chapter 7: 28 reviewed, 2 issue, 0 pending
- Chapter 13: 54 reviewed, 1 issue, 0 pending
- Chapter 1: 23 reviewed, 3 issue, 0 pending
- Chapter 2: 15 reviewed, 0 issue, 0 pending

The `issue` pages are intentional source caveats in the supplied PDFs, not unresolved app TODOs.

### Regression and math evidence

Automated checks currently cover:

- structure/content smoke expectations;
- PDF ledger completeness;
- Chapter 7 source fidelity;
- Chapters 1–2 source fidelity;
- Chapter 13 source fidelity;
- independent math verification for corrected and representative formulas;
- course-readiness integrity checks;
- exam-sprint integrity checks;
- layout regression checks.

Most recent full verification command:

```bash
npm test
```

Most recent result:

- Smoke checks passed.
- Audit ledger checks passed.
- Content regression checks passed.
- Chapter 7 coverage checks passed.
- Chapters 1–2 coverage checks passed.
- Chapter 13 coverage checks passed.
- Independent math verification checks passed.
- Mobile layout CSS checks passed.
- Exam sprint checks passed.
- Course readiness checks passed.

### Desktop browser evidence

Desktop route sweep was run across all 25 routes:

- 20 topic routes
- `exam-sprint`
- `mixed`
- `formulas`
- `progress`
- `decision-tree`

Observed:

- every route rendered;
- headings matched the route;
- content was non-empty;
- KaTeX appeared where expected;
- browser console reported `0` errors and `0` warnings.

Representative desktop utility flows also worked:

- topic navigation;
- source/provenance rendering;
- mixed practice route;
- formula sheet route;
- decision tree route;
- exam sprint route chips.

## What is now strong enough to trust

### 1. Source faithfulness

The app is no longer casually claiming invented Chapter 7/13 examples are textbook examples. Verified textbook examples now carry provenance, and known source inconsistencies are disclosed instead of hidden.

### 2. Mathematical reliability

Known wrong or misleading content found during the audit was corrected and backed by regression tests. The most fragile areas, especially Chapters 7, 2.2, 13.2, 13.3, 13.6, 13.7, and 13.8, now have targeted verification.

### 3. Learning flow

The app now supports two realistic modes of study:

- full structured course flow;
- compact seven-day `Exam Sprint` flow for last-week preparation.

Worked examples, paper-first prompts, mixed recognition practice, and formula recall are all present in the current app.

### 4. Desktop usability

For desktop use, the app is in a good state:

- routes render;
- no observed browser-console noise;
- math renders;
- study utilities are reachable;
- content volume is now substantial.

## Remaining caveats

### 1. PDF source caveats remain, but they are disclosed

Some supplied PDF pages themselves contain inconsistencies or omissions. These have been preserved as source notes or corrected-PDF-error labels where relevant. That is acceptable and more trustworthy than pretending the source is clean.

### 2. “Every mathematical claim” cannot be claimed with theorem-prover certainty

The current evidence is strong enough for practical trust, but not a formal proof of every displayed algebraic line in the app. The audit relies on:

- page-by-page visual review;
- direct content correction;
- targeted independent math checks;
- readiness integrity checks;
- desktop browser verification.

That is enough to support real study use, but it is not the same thing as machine-proving every line in every worked step.

### 3. Desktop is the supported priority

Desktop readiness has stronger final evidence than mobile. Since the current requirement is desktop-only, this is acceptable.

## Readiness judgment

For desktop exam preparation, the current app is credible enough to serve as a primary study resource, provided the student still:

- works problems on paper;
- uses the source notes honestly;
- treats the app as a guide plus practice engine, not as a substitute for all written work.

In short:

- trustworthy enough for primary desktop study use: **yes**
- mathematically/audit-perfect in a formal sense: **no**
- honest about its source limitations: **yes**
- strong enough for the final week exam sprint: **yes**

## Recommended final usage pattern

1. Start with `#exam-sprint`.
2. When a day points to a topic, study that topic’s worked examples slowly.
3. Solve practice on paper before revealing.
4. Use `#mixed` daily for method recognition.
5. Use `#formulas` for hide/reveal recall.
6. Use `#decision-tree` only when first-order ODE recognition feels shaky.
