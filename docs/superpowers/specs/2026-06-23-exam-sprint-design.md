# Exam Sprint Mode Design

## Context

The app now has broad PDF-aligned course content, but a student with one week left should not have to decide what to study next from a full course map. The sprint mode should turn the audited material into a compact daily path while preserving access to the full course.

## Selected approach

Add a dedicated `exam-sprint` route backed by a small `course.examSprint` data structure in `js/content.js`.

Each sprint day includes:

- a short theme and reason;
- a realistic time box;
- 4–6 concrete tasks;
- direct route chips into existing topics, formulas, decision tree, and mixed practice;
- a paper-first checkpoint so the app remains active practice instead of passive reading.

This is intentionally not a replacement for the course. It is a triage layer over the existing course that says, “do these important things today, in this order.”

## Requirements

- Provide exactly seven days.
- Cover calculus rescue, Chapter 7 integration techniques, ODE foundations, separable/linear/exact/Bernoulli methods, and high-yield Chapter 13 topics.
- Include mixed-method recognition and formula recall more than once.
- Keep each day compact enough for exam week.
- Make the route visible from the sidebar utility links.
- Render route chips using existing hash navigation.
- Preserve existing progress, mixed-practice, formula-sheet, and topic routes.
- Add regression tests so the sprint cannot silently lose high-yield topics or grow into an impossible schedule.

## Non-goals

- No calendar integration.
- No user-configurable exam date yet.
- No new persistence model beyond existing localStorage progress.
- No attempt to reproduce every PDF exercise inside sprint mode.

## Verification

- Node tests prove `course.examSprint` has seven days, contains required route targets, has compact task counts, includes paper-first work, and is wired into `npm test`.
- Browser QA proves `#exam-sprint` renders, route chips exist, KaTeX/app scripts do not throw, and mobile width has no horizontal overflow.

