# Trust Foundation and Critical Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish auditable PDF provenance and mathematical regression checks, then correct the current high-confidence source-fidelity defects before expanding the course.

**Architecture:** Preserve the working framework-free app while adding independent audit artifacts and focused Node test files. Extend the existing content constructors compatibly so corrected items can carry structured provenance without forcing an unsafe all-at-once migration of the 1,045-line content file.

**Tech Stack:** Vanilla JavaScript, Node.js, JSON audit artifacts, KaTeX, HTML/CSS.

---

## Scope Boundary

This is Phase 1 of the approved rebuild. It produces a trustworthy testing and
provenance foundation plus the first critical corrections. It does not claim that
all 126 pages or all runtime mathematics have been verified; subsequent plans will
cover Chapter 7, Chapters 1–2, Chapter 13, the seven-day experience, and final
browser/completion verification.

The workspace contains an empty `.git` directory, so Git commands currently fail.
Do not initialize or replace repository metadata without explicit user approval.
Each task therefore ends with a verification checkpoint instead of a commit.

## File Structure

- Create `package.json` — canonical command for all automated checks.
- Create `audit/pdf-ledger.json` — one explicit record per PDF page.
- Create `audit/source-issues.md` — confirmed source defects and app corrections.
- Create `scripts/create-pdf-ledger.mjs` — deterministic ledger generator.
- Create `tests/helpers/load-course.mjs` — shared course loader and lookup helpers.
- Create `tests/audit-ledger.mjs` — page-count, status, and evidence validation.
- Create `tests/content-regressions.mjs` — structured source-fidelity assertions.
- Create `tests/math-verification.mjs` — independent numerical/algebraic checks.
- Modify `js/content.js` — compatible provenance support and critical corrections.
- Modify `tests/smoke.mjs` — remove the false definite-integral requirement.

### Task 1: Canonical Test Command

**Files:**
- Create: `package.json`
- Test: `tests/smoke.mjs`

- [ ] **Step 1: Create the failing package command check**

Run:

```bash
npm test
```

Expected: FAIL because `package.json` does not exist.

- [ ] **Step 2: Add the minimal package manifest**

Create `package.json`:

```json
{
  "name": "ode-exam-prep",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node tests/smoke.mjs && node tests/audit-ledger.mjs && node tests/content-regressions.mjs && node tests/math-verification.mjs"
  }
}
```

- [ ] **Step 3: Run the existing smoke test directly**

Run:

```bash
node tests/smoke.mjs
```

Expected: PASS with `Smoke checks passed.`

- [ ] **Step 4: Record checkpoint**

Run:

```bash
git status --short
```

Expected: `fatal: not a git repository`; preserve the files and continue without
rewriting `.git`.

### Task 2: Explicit 126-Page Audit Ledger

**Files:**
- Create: `scripts/create-pdf-ledger.mjs`
- Create: `audit/pdf-ledger.json`
- Create: `tests/audit-ledger.mjs`

- [ ] **Step 1: Write the failing ledger test**

Create `tests/audit-ledger.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const ledgerPath = path.join(root, "audit/pdf-ledger.json");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(fs.existsSync(ledgerPath), "Missing audit/pdf-ledger.json");

const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
const expected = new Map([
  ["chapter-7", 30],
  ["chapter-13", 55],
  ["chapter-1", 26],
  ["chapter-2", 15]
]);
const allowedStatuses = new Set(["pending", "reviewed", "issue"]);
const pages = ledger.pdfs.flatMap((pdf) =>
  pdf.pages.map((page) => ({ ...page, pdfId: pdf.id }))
);

assert(ledger.version === 1, "Ledger version must be 1");
assert(pages.length === 126, `Expected 126 page records, received ${pages.length}`);

for (const pdf of ledger.pdfs) {
  assert(expected.get(pdf.id) === pdf.pageCount, `Wrong page count for ${pdf.id}`);
  assert(pdf.pages.length === pdf.pageCount, `Missing page records for ${pdf.id}`);
  assert(
    new Set(pdf.pages.map((page) => page.page)).size === pdf.pageCount,
    `Duplicate page records for ${pdf.id}`
  );
}

for (const page of pages) {
  assert(allowedStatuses.has(page.status), `Invalid status for ${page.pdfId} page ${page.page}`);
  assert(typeof page.scope === "string" && page.scope.length > 0, `Missing scope for ${page.pdfId} page ${page.page}`);
  if (page.status !== "pending") {
    assert(Array.isArray(page.evidence) && page.evidence.length > 0, `Reviewed page lacks evidence: ${page.pdfId} page ${page.page}`);
  }
}

console.log("Audit ledger checks passed.");
```

- [ ] **Step 2: Run the ledger test to verify RED**

Run:

```bash
node tests/audit-ledger.mjs
```

Expected: FAIL with `Missing audit/pdf-ledger.json`.

- [ ] **Step 3: Add the deterministic ledger generator**

Create `scripts/create-pdf-ledger.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "audit/pdf-ledger.json");
const pdfs = [
  { id: "chapter-7", file: "Chapter 7.pdf", pageCount: 30, scope: "Integration techniques" },
  { id: "chapter-13", file: "Chapter 13.pdf", pageCount: 55, scope: "Multivariable calculus" },
  { id: "chapter-1", file: "Chapter 01_ODE_new02.pdf", pageCount: 26, scope: "ODE foundations and models" },
  { id: "chapter-2", file: "Chapter 02_ODE04.pdf", pageCount: 15, scope: "First-order ODE methods" }
];

const reviewed = new Map([
  ["chapter-7:1", ["pdf_images/ch7/page-01.png", "Verified Example 1 visually"]],
  ["chapter-7:4", ["pdf_images/ch7/page-04.png", "Verified Example 6 is indefinite"]],
  ["chapter-7:21", ["pdf_images/ch7/ch7_4_sub_ex3_ellipse_ex4_arclength.png", "Verified ellipse and arc-length prompts"]],
  ["chapter-7:22", ["pdf_images/ch7/ch7_4_sub_ex3_ellipse_ex4_arclength.png", "Verified arc-length solution"]],
  ["chapter-7:23", ["pdf_images/ch7/page-23.png", "Verified radical Example 5"]],
  ["chapter-7:24", ["pdf_images/ch7/ch7_4_sub_ex6_completing_square.png", "Verified repeated printed Example 5"]],
  ["chapter-13:19", ["pdf_images/ch13/page-19.png", "Verified negative sign in Example 9"]],
  ["chapter-13:20", ["pdf_images/ch13/page-20.png", "Verified Example 9 continuity conclusion"]],
  ["chapter-13:21", ["pdf_images/ch13/ch13_3_partials_ex12_second_order.png", "Verified Example 12 function"]],
  ["chapter-13:47", ["pdf_images/ch13/ch13_7_tangent_ex1c_angle.png", "Verified tangent-plane angle"]]
]);

const ledger = {
  version: 1,
  generatedAt: "2026-06-23",
  pdfs: pdfs.map((pdf) => ({
    ...pdf,
    pages: Array.from({ length: pdf.pageCount }, (_, index) => {
      const page = index + 1;
      const evidence = reviewed.get(`${pdf.id}:${page}`);
      return {
        page,
        status: evidence ? "reviewed" : "pending",
        scope: pdf.scope,
        evidence: evidence || []
      };
    })
  }))
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(ledger, null, 2)}\n`);
console.log(`Wrote ${output}`);
```

- [ ] **Step 4: Generate the ledger**

Run:

```bash
node scripts/create-pdf-ledger.mjs
```

Expected: PASS and create `audit/pdf-ledger.json` with 126 page records.

- [ ] **Step 5: Verify GREEN**

Run:

```bash
node tests/audit-ledger.mjs
```

Expected: PASS with `Audit ledger checks passed.`

- [ ] **Step 6: Record checkpoint**

Run:

```bash
node tests/smoke.mjs && node tests/audit-ledger.mjs
```

Expected: both suites pass.

### Task 3: Structured Course Test Helpers

**Files:**
- Create: `tests/helpers/load-course.mjs`
- Modify: `tests/content-regressions.mjs`

- [ ] **Step 1: Write a failing helper consumer**

Create `tests/content-regressions.mjs`:

```js
import { loadCourse, findExample } from "./helpers/load-course.mjs";

const course = loadCourse();
const example = findExample(course, "Example 6: inverse tangent");

if (!example) {
  throw new Error("Could not locate Chapter 7.2 Example 6");
}

console.log("Content regression harness loaded.");
```

- [ ] **Step 2: Run the test to verify RED**

Run:

```bash
node tests/content-regressions.mjs
```

Expected: FAIL because `tests/helpers/load-course.mjs` does not exist.

- [ ] **Step 3: Add the shared loader**

Create `tests/helpers/load-course.mjs`:

```js
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "../..");

export function loadCourse() {
  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(path.join(root, "js/content.js"), "utf8"),
    context,
    { filename: "js/content.js" }
  );
  if (!context.window.ODE_COURSE) {
    throw new Error("window.ODE_COURSE was not created");
  }
  return context.window.ODE_COURSE;
}

export function allExamples(course) {
  return course.modules.flatMap((module) =>
    module.topics.flatMap((topic) =>
      (topic.examples || []).map((example) => ({ ...example, topicId: topic.id }))
    )
  );
}

export function findExample(course, title) {
  return allExamples(course).find((example) => example.title === title);
}

export function assert(condition, message) {
  if (!condition) throw new Error(message);
}
```

- [ ] **Step 4: Verify the helper loads and reaches the expected failure**

Run:

```bash
node tests/content-regressions.mjs
```

Expected: FAIL with `Could not locate Chapter 7.2 Example 6`, because the current
title is `Example 6: definite inverse tangent`.

### Task 4: Correct False PDF Fidelity and Add Provenance

**Files:**
- Modify: `js/content.js:3-14`
- Modify: `js/content.js:83-89`
- Modify: `js/content.js:191-198`
- Modify: `js/content.js:507-512`
- Modify: `tests/content-regressions.mjs`
- Modify: `tests/smoke.mjs:76-137`
- Create: `audit/source-issues.md`

- [ ] **Step 1: Replace the harness with failing structured regressions**

Replace `tests/content-regressions.mjs` with:

```js
import { assert, findExample, loadCourse } from "./helpers/load-course.mjs";

const course = loadCourse();

const inverseTangent = findExample(course, "Example 6: inverse tangent");
assert(inverseTangent, "Missing Chapter 7.2 Example 6");
assert(
  inverseTangent.problem.includes(String.raw`\int \tan^{-1}x\,dx`),
  "Chapter 7.2 Example 6 must be the PDF's indefinite integral"
);
assert(
  !inverseTangent.problem.includes("_0^1"),
  "Chapter 7.2 Example 6 must not invent definite bounds"
);
assert(
  inverseTangent.steps.at(-1).math.includes(
    String.raw`x\tan^{-1}x-\frac12\ln(1+x^2)+C`
  ),
  "Chapter 7.2 Example 6 must have the correct antiderivative"
);
assert(
  inverseTangent.provenance?.page === 4 &&
  inverseTangent.provenance?.label === "Example 6",
  "Chapter 7.2 Example 6 requires page-level provenance"
);

const completingSquare = findExample(
  course,
  "Example 5 (printed label repeated): completing the square"
);
assert(completingSquare, "Missing Chapter 7.4 repeated Example 5");
assert(
  completingSquare.provenance?.note.includes("repeats"),
  "Repeated PDF numbering must be disclosed"
);

const partialContinuity = findExample(
  course,
  "Example 9: partials without continuity"
);
assert(partialContinuity, "Missing Chapter 13.3 Example 9");
assert(
  partialContinuity.problem.includes(String.raw`-\frac{xy}{x^2+y^2}`),
  "Chapter 13.3 Example 9 must preserve the PDF's negative sign"
);
assert(
  partialContinuity.steps.some((step) =>
    step.math.includes(String.raw`f(x,x)=-\frac12`)
  ),
  "Chapter 13.3 Example 9 path value must preserve the negative sign"
);

console.log("Content regression checks passed.");
```

- [ ] **Step 2: Run the regressions to verify RED**

Run:

```bash
node tests/content-regressions.mjs
```

Expected: FAIL on the missing corrected Example 6 title.

- [ ] **Step 3: Extend constructors without breaking legacy content**

Modify the constructor block in `js/content.js`:

```js
  function step(math, why) {
    return { math, why };
  }

  function ex(title, problem, steps, takeaway, source, provenance = null) {
    return { title, problem, steps, takeaway, source, provenance };
  }

  function pr(title, problem, hint, steps, method, provenance = null) {
    return { title, problem, hint, steps, method, provenance };
  }
```

- [ ] **Step 4: Correct Chapter 7.2 Example 6**

Replace the current Example 6 with:

```js
    ex("Example 6: inverse tangent", m`Evaluate\quad \int \tan^{-1}x\,dx`, [
      step(m`u=\tan^{-1}x,\quad dv=dx`, "Inverse trigonometric functions come first under LIATE."),
      step(m`du=\frac{1}{1+x^2}\,dx,\quad v=x`, "Differentiate inverse tangent and integrate dx."),
      step(m`\int \tan^{-1}x\,dx=x\tan^{-1}x-\int\frac{x}{1+x^2}\,dx`, "Apply integration by parts."),
      step(m`\int\frac{x}{1+x^2}\,dx=\frac12\ln(1+x^2)`, "Use u = 1 + x squared; the denominator is always positive."),
      step(m`x\tan^{-1}x-\frac12\ln(1+x^2)+C`, "Combine the boundary-free antiderivative terms.")
    ], "Differentiate the result to check that it returns inverse tangent.", "Chapter 7.2", {
      pdf: "Chapter 7.pdf",
      page: 4,
      section: "7.2",
      label: "Example 6",
      type: "pdf-example",
      status: "verified"
    }),
```

- [ ] **Step 5: Preserve Chapter 7.4's repeated printed label**

Change the completing-square example title and append provenance:

```js
    ex("Example 5 (printed label repeated): completing the square", m`Evaluate\quad \int\frac{x}{x^2-4x+8}\,dx`, [
      step(m`x^2-4x+8 = (x-2)^2+4`, "Complete the square in the denominator."),
      step(m`u=x-2,\ du=dx,\ x=u+2`, "Substitute u = x-2."),
      step(m`\int\frac{u+2}{u^2+4}\,du = \int\frac{u}{u^2+4}\,du + 2\int\frac{du}{u^2+4}`, "Split into logarithmic and inverse-tangent forms."),
      step(m`\frac{1}{2}\ln(u^2+4)`, "The numerator u is one half of the denominator's derivative."),
      step(m`\tan^{-1}\left(\frac{u}{2}\right)`, "Use the standard integral of 1 over u squared plus a squared."),
      step(m`\frac{1}{2}\ln[(x-2)^2+4] + \tan^{-1}\left(\frac{x-2}{2}\right) + C`, "Combine results and back-substitute.")
    ], "The PDF prints this as a second Example 5; the app preserves that source defect explicitly.", "Chapter 7.4", {
      pdf: "Chapter 7.pdf",
      page: 24,
      section: "7.4",
      label: "Example 5 (second occurrence)",
      type: "pdf-example",
      status: "verified",
      note: "The PDF repeats the label Example 5 on pages 23 and 24."
    })
```

- [ ] **Step 6: Correct Chapter 13.3 Example 9**

Replace the current Example 9 with:

```js
    ex("Example 9: partials without continuity", m`f(x,y)=\begin{cases}-\frac{xy}{x^2+y^2},&(x,y)\ne(0,0)\\0,&(x,y)=(0,0)\end{cases}`, [
      step(m`f_x(0,0)=\lim_{h\to0}\frac{f(h,0)-f(0,0)}{h}=0`, "Along the x-axis the numerator contains y = 0."),
      step(m`f_y(0,0)=\lim_{h\to0}\frac{f(0,h)-f(0,0)}{h}=0`, "Along the y-axis the numerator contains x = 0."),
      step(m`Along\ y=x,\quad f(x,x)=-\frac{x^2}{2x^2}=-\frac12`, "The diagonal path approaches a value different from f(0,0)."),
      step(m`Partials\ exist,\ but\ f\ is\ not\ continuous\ at\ (0,0)`, "Existing coordinate partials do not force a multivariable limit.")
    ], "Partial derivatives at a point do not by themselves guarantee continuity.", "Chapter 13.3", {
      pdf: "Chapter 13.pdf",
      page: 19,
      section: "13.3",
      label: "Example 9",
      type: "pdf-example",
      status: "verified"
    }),
```

- [ ] **Step 7: Remove the false smoke requirement**

In `tests/smoke.mjs`, replace:

```js
String.raw`\int_0^1 \tan^{-1}x\,dx`,
```

with:

```js
String.raw`\int \tan^{-1}x\,dx`,
```

Add this negative assertion near the existing negative checks:

```js
assert(
  !problemText.includes(String.raw`\int_0^1 \tan^{-1}x\,dx`),
  "Chapter 7.2 Example 6 must not invent definite bounds"
);
```

- [ ] **Step 8: Record confirmed source issues**

Create `audit/source-issues.md`:

```markdown
# Confirmed Source and Fidelity Issues

## Chapter 7, page 4 — Example 6

- PDF: indefinite `∫ tan⁻¹x dx`.
- Previous app/test: changed it to a definite integral from 0 to 1.
- Resolution: restore the indefinite PDF problem and independently verified
  antiderivative `x tan⁻¹x - 1/2 ln(1+x²) + C`.

## Chapter 7, pages 23–24 — repeated Example 5

- PDF: labels both the radical integral and completing-square integral “Example 5.”
- Previous app: silently renamed the second item “Example 6.”
- Resolution: retain the printed label and disclose the numbering defect.

## Chapter 13, page 19 — Example 9

- PDF: `-xy/(x²+y²)` away from the origin.
- Previous app: used the positive function.
- Resolution: restore the negative sign throughout the problem and path analysis.

## Chapter 1, page 5 — Exercise 11

- PDF: the supplied function does not satisfy the printed differential equation.
- Resolution: retain a corrected-source warning; do not present the verification as
  successful.

## Chapter 1, page 23 — falling-body model

- PDF: contains inconsistent sign conventions and omits a factor of `t` in one
  displayed position formula.
- Resolution: teach one declared coordinate convention and explicitly note the
  source defect when this content is rebuilt.
```

- [ ] **Step 9: Verify GREEN**

Run:

```bash
node tests/content-regressions.mjs
node tests/smoke.mjs
```

Expected: both pass.

### Task 5: Independent Mathematical Regression Checks

**Files:**
- Create: `tests/math-verification.mjs`

- [ ] **Step 1: Write the independent math checks**

Create `tests/math-verification.mjs`:

```js
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function close(actual, expected, tolerance, message) {
  assert(Math.abs(actual - expected) <= tolerance, `${message}: expected ${expected}, received ${actual}`);
}

function derivative(fn, x) {
  const h = 1e-6;
  return (fn(x + h) - fn(x - h)) / (2 * h);
}

const inverseTangentAntiderivative = (x) =>
  x * Math.atan(x) - 0.5 * Math.log(1 + x * x);

for (const x of [-2, -0.5, 0, 0.75, 3]) {
  close(
    derivative(inverseTangentAntiderivative, x),
    Math.atan(x),
    1e-6,
    `Inverse-tangent antiderivative failed at x=${x}`
  );
}

const partialContinuity = (x, y) =>
  x === 0 && y === 0 ? 0 : -(x * y) / (x * x + y * y);

close(partialContinuity(1e-4, 1e-4), -0.5, 1e-12, "Example 9 path y=x");
close(partialContinuity(1e-4, -1e-4), 0.5, 1e-12, "Example 9 path y=-x");
close(partialContinuity(1e-4, 0), 0, 1e-12, "Example 9 x-axis");

const tangentPlaneAngle = Math.acos(1 / Math.sqrt(66)) * 180 / Math.PI;
close(tangentPlaneAngle, 82.92944488303417, 1e-10, "Tangent-plane angle");

console.log("Independent math verification checks passed.");
```

- [ ] **Step 2: Run the checks**

Run:

```bash
node tests/math-verification.mjs
```

Expected: PASS with `Independent math verification checks passed.`

- [ ] **Step 3: Run the complete Phase 1 suite**

Run:

```bash
npm test
```

Expected:

```text
Smoke checks passed.
Audit ledger checks passed.
Content regression checks passed.
Independent math verification checks passed.
```

- [ ] **Step 4: Record checkpoint**

Run:

```bash
git status --short
```

Expected: Git remains unavailable because `.git` is empty. Do not claim a commit;
list all files changed in the implementation handoff.

## Plan Self-Review

- Spec coverage in this phase: page ledger, provenance foundation, source-issue
  ledger, strong regressions, and three confirmed fidelity corrections.
- Deferred by design: full page review, all chapter rebuilds, seven-day dashboard,
  visuals, accessibility, offline KaTeX, browser automation, and final completion
  report. Each remains required by the approved specification.
- Placeholder scan: no unresolved placeholders are used inside implementation
  steps.
- Type consistency: provenance uses `pdf`, `page`, `section`, `label`, `type`,
  `status`, and optional `note` consistently.
