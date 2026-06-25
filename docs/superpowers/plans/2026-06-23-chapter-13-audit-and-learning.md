# Chapter 13 Audit and Learning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Chapter 13 portion of the app a source-faithful, mathematically verified, compact exam-prep course based on all 55 visually inspected PDF pages.

**Architecture:** Preserve the existing `content.js` data model and attach verified PDF provenance to every textbook example. Add only the missing examples and selected high-yield PDF exercises needed to cover distinct exam patterns, while extending numerical/algebraic tests so wrong signs, derivatives, gradients, planes, and classifications cannot silently regress.

**Tech Stack:** Vanilla JavaScript, Node.js assertion tests, KaTeX, HTML/CSS, Playwright browser verification.

---

### Task 1: Lock the visual PDF audit into the ledger

**Files:**
- Modify: `scripts/create-pdf-ledger.mjs`
- Modify: `tests/audit-ledger.mjs`
- Regenerate: `audit/pdf-ledger.json`

- [ ] **Step 1: Make the ledger test require all 55 Chapter 13 pages**

Extend the completed-PDF loop in `tests/audit-ledger.mjs` to include `"chapter-13"`, requiring every page to have `reviewed` or `issue` status, a page-specific summary, a course decision, and visual evidence.

- [ ] **Step 2: Run the test and verify RED**

Run: `node tests/audit-ledger.mjs`

Expected: FAIL because most Chapter 13 pages are still `pending` and lack summaries.

- [ ] **Step 3: Add page-specific Chapter 13 records**

Add 55 records to `scripts/create-pdf-ledger.mjs`, covering sections 13.1, 13.2, 13.3, 13.5, 13.6, 13.7, and 13.8. Record that page 26 labels Example 2 only as homework without supplying a problem, and that pages 50–52 introduce extrema before the source jumps to Example 3.

- [ ] **Step 4: Regenerate and verify GREEN**

Run:

```bash
node scripts/create-pdf-ledger.mjs
node tests/audit-ledger.mjs
```

Expected: both commands pass.

### Task 2: Add Chapter 13 source-fidelity regression tests

**Files:**
- Create: `tests/chapter-13.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing source-fidelity assertions**

Load the course data and assert:

- all PDF examples have verified Chapter 13 provenance;
- §13.6 includes PDF Example 1 with `f(x,y)=xy`, `P=(1,2)`, and `u=(sqrt(3)/2,1/2)`;
- §13.8 includes PDF Example 3 with `3x²-2xy+y²-8y`;
- §13.2 Example 7 describes an infinity-over-infinity L'Hôpital form, not `0/0`;
- §13.7 contains the simplified planes `x+8y+z=18` and `-4x-4y+z=-8`;
- selected instructor-marked §13.7 exercises are present as PDF practice.

- [ ] **Step 2: Add the test to `npm test` and verify RED**

Run: `node tests/chapter-13.mjs`

Expected: FAIL first on the missing §13.6 Example 1.

### Task 3: Correct and strengthen the Chapter 13 learning content

**Files:**
- Modify: `js/content.js`

- [ ] **Step 1: Add verified provenance**

Use `markSourceExamples` to map every Chapter 13 worked example to its exact PDF page or page range. Use `pdf-example` for worked textbook examples and `pdf-assigned-exercise` for selected exercise-set problems.

- [ ] **Step 2: Correct the polar-limit explanation**

Change the L'Hôpital step for

```text
(x²+y²) ln(x²+y²)
```

to identify `2 ln r / r^-2` as an `-∞/∞` indeterminate form.

- [ ] **Step 3: Add directional-derivative Example 1**

Teach the definition calculation for:

```text
f(x,y)=xy, P=(1,2), u=(sqrt(3)/2,1/2)
```

and obtain `D_u f(1,2)=sqrt(3)+1/2`, including the source interpretation of local rate of increase.

- [ ] **Step 4: Add extrema Example 3 and core theory**

Add the PDF quadratic example with critical point `(2,6)`, discriminant `D=8`, and a relative minimum. Add concise distinctions among relative/absolute extrema, the closed-and-bounded existence theorem, critical points, and the inconclusive `D=0` case.

- [ ] **Step 5: Complete tangent-plane outputs and selected PDF practice**

Show the simplified planes in both textbook examples. Add compact practice for the instructor-marked exercise patterns: implicit ellipsoid, implicit mixed-product surface, sphere, logarithmic explicit surface, exponential-trigonometric explicit surface, and square-root explicit surface.

- [ ] **Step 6: Verify GREEN**

Run:

```bash
node tests/chapter-13.mjs
npm test
```

Expected: all tests pass.

### Task 4: Independently verify the Chapter 13 mathematics

**Files:**
- Modify: `tests/math-verification.mjs`

- [ ] **Step 1: Add failing numerical/algebraic checks**

Check representative points for:

- first and second partial derivatives;
- both multivariable chain-rule examples;
- implicit derivatives;
- directional derivatives and normalized directions;
- tangent planes containing their stated points and using correct normals;
- extrema critical points and discriminants.

- [ ] **Step 2: Run the checks and verify RED if any content formula is wrong**

Run: `node tests/math-verification.mjs`

Expected: existing correct formulas pass; any mismatch exposes the exact expression needing correction.

- [ ] **Step 3: Correct only proven mismatches**

Modify `js/content.js` only when the independent calculation disagrees with the displayed app result.

- [ ] **Step 4: Run the full suite**

Run: `npm test`

Expected: all checks pass without warnings.

### Task 5: Verify the Chapter 13 browser experience

**Files:**
- Modify only if a browser defect is reproduced: `js/app.js`, `css/style.css`, or `js/content.js`

- [ ] **Step 1: Open every Chapter 13 topic**

Use the running local server at `http://localhost:5173` and visit all seven Chapter 13 routes at desktop and mobile widths.

- [ ] **Step 2: Exercise interactive controls**

For representative examples and practices, test Show Next, Show All, Reset, hints, solution reveal, source labels, and topic navigation.

- [ ] **Step 3: Inspect rendering and console output**

Confirm all new KaTeX renders, no content is clipped or horizontally overflowing, source warnings remain readable, and the console has no errors or warnings.

- [ ] **Step 4: Run final verification**

Run:

```bash
npm test
```

Expected: all automated checks pass after browser QA.
