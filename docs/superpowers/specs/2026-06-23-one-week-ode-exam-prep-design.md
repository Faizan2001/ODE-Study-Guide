# One-Week ODE Exam-Prep Rebuild Design

## Purpose

Turn the four supplied course PDFs into a trustworthy, interesting, and finishable
seven-day study course for a student who once knew calculus but is now rusty.

The app must be sufficient for exam preparation without attempting to reproduce
every page as a textbook clone. It will teach every examinable method, faithfully
cover the most important PDF examples and assigned exercise patterns, and provide
enough deliberate practice to build recognition and fluency within one week.

## Success Criteria

The rebuild is successful when:

1. Every page of all four PDFs has been inspected using rendered page images.
2. Every formula and worked solution presented in the app has been independently
   recalculated.
3. Every examinable method named in the PDFs appears in the course.
4. Every PDF worked example that introduces or materially extends a method is
   represented faithfully.
5. Assigned exercises are sampled by distinct problem pattern, with priority given
   to exercises solved or emphasized in the supplied notes.
6. PDF source errors are clearly identified and corrected rather than taught.
7. Additional practice is visibly labeled and never presented as a PDF example.
8. A student can complete the primary learning path in seven days at approximately
   two to three focused hours per day.
9. The app works on desktop and mobile without layout overlap, console errors, or
   loss of progress.
10. Automated tests verify provenance, representative coverage, known regressions,
    content structure, and critical UI behavior.

## Scope and Content Selection

### Must Learn

These items form the primary seven-day path:

- Calculus repair: core differentiation, antiderivatives, substitution, algebraic
  manipulation, logarithms, exponentials, and trigonometric identities needed by
  later topics.
- Integration techniques from Chapter 7: integration by parts, trigonometric
  integrals, trigonometric substitution, and partial fractions.
- ODE foundations from Chapter 1: terminology, order, linearity, verification,
  initial-value problems, solution intervals, and model recognition.
- First-order methods from Chapter 2: separable, linear, exact, integrating-factor,
  and Bernoulli equations.
- Multivariable topics from Chapter 13 that appear in the supplied notes:
  functions and domains, limits and continuity, partial derivatives, chain rule,
  gradients and directional derivatives, tangent planes, and extrema.
- Every worked example that introduces a new method or is explicitly marked as
  homework.
- Every distinct pattern among the assigned exercises, including the exercises
  whose solutions are printed in the PDFs.

### Useful Extra

- One or two additional problems per method for retrieval and transfer.
- Short real-world explanations where they clarify why a model or method exists.
- Optional challenge problems and alternate solution methods.
- Selected diagrams for domains, level curves, gradients, tangent planes, and
  physical models.

### Deliberately Omitted from the Primary Path

- Repetitive exercises that add no new recognition or algebraic pattern.
- Long historical exposition that does not affect solving exam questions.
- Decorative textbook figures that do not carry mathematical information.
- Advanced theory or proof details not used by the supplied examples or exercises.

Omitted material remains recorded in the audit ledger so omission is deliberate
rather than accidental.

## Source-Fidelity Rules

Every course item will include machine-readable provenance:

- PDF file
- PDF page number
- section
- printed example or exercise label
- source type
- verification status

The source type is one of:

- `pdf-example`
- `pdf-assigned-exercise`
- `pdf-theory`
- `corrected-pdf-error`
- `additional-practice`

The app will preserve the PDF's printed labels even when the PDF repeats or skips a
number. A short note will explain source numbering defects. For example, Chapter
7.4 prints two different items as “Example 5”; the app must not silently rewrite
the second item as “Example 6.”

Source fidelity does not require copying an erroneous answer. When the PDF is
wrong, the app will show the corrected mathematics and a concise source-warning
note.

## Mathematical Verification Standard

Every app example, practice solution, mixed-practice answer, formula, and model
must pass two checks:

1. Visual comparison against the rendered PDF page when the item claims PDF
   provenance.
2. Independent recalculation from the problem statement.

Verification includes:

- differentiating antiderivatives;
- substituting proposed ODE solutions back into the differential equation;
- checking initial conditions and maximal intervals;
- checking exactness and reconstructed potential functions;
- checking integrating factors;
- checking partial derivatives and mixed partial notation;
- checking vector normalization, dot products, and angles;
- checking domains, absolute values, signs, constants, and endpoint restrictions;
- checking numerical approximations independently.

Known PDF defects will be stored in a source-issues ledger with the original
expression, corrected expression, explanation, and page reference.

## Course Experience

### Seven-Day Route

The home screen will present a primary route:

1. Day 1 — calculus repair and integration foundations
2. Day 2 — advanced integration techniques
3. Day 3 — ODE foundations, IVPs, and models
4. Day 4 — separable and linear equations
5. Day 5 — exact and Bernoulli equations
6. Day 6 — multivariable calculus
7. Day 7 — mixed exam rehearsal and weak-area review

The route is adaptive only in a simple, transparent way. Incorrect self-assessments
and missed mixed-practice questions add short review blocks; they do not rearrange
the entire course.

### Learning Sequence per Method

Each method uses:

1. a prerequisite recall check;
2. a compact plain-language explanation;
3. a fully worked PDF example;
4. a faded example with some steps hidden;
5. an independent same-pattern problem;
6. a method-recognition question;
7. a delayed mixed-review problem.

The student is prompted to write on paper before revealing solutions. Hints reveal
the next decision, not the final answer.

### Interest Without Distraction

Interest comes from clarity, visible progress, useful visual explanations, and
small moments of interaction. The app will avoid points, leaderboards, noisy
animations, and excessive choices.

## Information Architecture

The current `js/content.js` monolith will be replaced by focused content modules:

- `js/content/shared.js` — constructors and validation helpers
- `js/content/calculus.js`
- `js/content/chapter-7.js`
- `js/content/chapter-1.js`
- `js/content/chapter-2.js`
- `js/content/chapter-13.js`
- `js/content/mixed-practice.js`
- `js/content/source-issues.js`
- `js/content/course.js` — assembles and exports the course

Audit evidence will live separately from runtime content:

- `audit/pdf-ledger.json`
- `audit/math-verification.json`
- `audit/source-issues.md`
- `audit/completion-report.md`

The ledger records all 126 PDF pages, including pages intentionally excluded from
the primary course.

## Visuals

Repo-native SVG or HTML/CSS diagrams will be used when a visual is mathematically
important:

- domain boundaries;
- level curves and contour spacing;
- gradient direction;
- tangent plane and normal vector;
- trig-substitution reference triangles;
- mixing, circuit, and spring-model schematics.

Visuals must include text alternatives and must not be required to understand a
solution.

## Error Handling and Content Validation

Course assembly will reject:

- duplicate internal IDs;
- PDF-labeled content without complete provenance;
- `additional-practice` content presented with a PDF example label;
- examples or practices with missing steps;
- empty hints, explanations, or takeaways;
- unknown source types;
- references to missing topics.

KaTeX rendering failures will display the original expression in a readable fallback
and report the offending content ID in the console during development.

## Testing Strategy

### Content and Provenance

- Validate every runtime item against the content schema.
- Verify every PDF-derived item maps to an audit-ledger entry.
- Verify every required method and high-yield source item is covered.
- Verify all exclusions have a recorded rationale.
- Add explicit regressions for every discovered mathematical or source-fidelity
  defect.

### Mathematical Tests

Automated checks will verify identities that can be checked reliably in JavaScript,
including selected derivatives, substitutions, polynomial decompositions, vector
calculations, and numerical values. The audit ledger will record human-independent
recalculation evidence for symbolic steps that are impractical to automate.

Tests will never use mere string presence as proof of mathematical correctness.

### Browser Tests

Critical flows:

- navigation and hash routing;
- step-by-step reveal and reset;
- hints and solution reveal;
- day-plan progression;
- mixed-practice method selection;
- persistence and restoration;
- keyboard navigation;
- theme switching;
- mobile sidebar;
- no header overlap at representative desktop and mobile sizes;
- no console errors;
- readable fallback when external resources are unavailable.

### Accessibility

- keyboard reachability and visible focus;
- correct labels and expanded/collapsed states;
- sensible live-region usage;
- reduced accessibility-tree noise from math rendering;
- adequate contrast and touch-target size;
- no motion requirement.

## Delivery Order

1. Establish audit ledgers and content validation.
2. Correct current known false-fidelity and mathematical defects.
3. Audit and rebuild Chapter 7.
4. Audit and rebuild Chapters 1 and 2.
5. Audit and rebuild Chapter 13.
6. Assemble the seven-day route and high-yield practice flow.
7. Add essential visuals.
8. Fix layout, mobile, accessibility, and offline reliability.
9. Run the full mathematical, automated, and browser completion audit.

Each stage must leave the app usable and tests passing before the next stage begins.

## Completion Gate

The project is not complete merely because automated tests pass. Completion requires
all of the following evidence:

- all 126 pages marked reviewed in the audit ledger;
- no unresolved high-severity mathematical finding;
- every primary-path item marked independently verified;
- representative assigned-exercise coverage for every distinct method pattern;
- every deliberate omission documented;
- all automated suites passing;
- browser verification on desktop and mobile;
- no console errors or layout overlap;
- a final completion report that maps each success criterion to concrete evidence.

