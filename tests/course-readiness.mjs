import { loadCourse, assert } from "./helpers/load-course.mjs";

const course = loadCourse();
const topics = course.modules.flatMap((module) =>
  module.topics.map((topic) => ({ ...topic, moduleId: module.id, moduleTitle: module.title })),
);
const topicIds = new Set(topics.map((topic) => topic.id));
const knownUtilityRoutes = new Set(["mixed", "formulas", "decision-tree"]);
const knownMethods = new Set([
  "derivative",
  "differentiation",
  "integration",
  "product rule",
  "chain rule",
  "u-substitution",
  "integration by parts",
  "trig integral",
  "tangent/secant integral",
  "trig substitution",
  "arc length",
  "partial fractions: distinct",
  "partial fractions: repeated",
  "partial fractions: irreducible quadratic",
  "partial fractions: improper",
  "verification",
  "classification",
  "IVP",
  "modeling",
  "separable",
  "linear",
  "exact",
  "Bernoulli",
  "domain",
  "level curve",
  "limit",
  "partials",
  "chain rule",
  "implicit differentiation",
  "gradient",
  "tangent plane",
  "extrema",
  "max/min",
]);
const badTextPattern = /\b(TODO|FIXME|TBD|lorem ipsum)\b/i;

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateMathString(value, context) {
  assert(hasText(value), `${context} must have non-empty math/text`);
  assert(!badTextPattern.test(value), `${context} contains placeholder or invalid text: ${value}`);
  assert(!value.includes("NaN"), `${context} contains NaN`);
}

function validateSteps(steps, context) {
  assert(Array.isArray(steps), `${context} steps must be an array`);
  assert(steps.length > 0, `${context} must contain at least one worked step`);
  for (const [index, step] of steps.entries()) {
    validateMathString(step.math, `${context} step ${index + 1} math`);
    assert(hasText(step.why), `${context} step ${index + 1} needs a why explanation`);
    assert(!badTextPattern.test(step.why), `${context} step ${index + 1} why contains placeholder text`);
  }
}

function validateProvenance(provenance, context) {
  if (!provenance) return;
  assert(
    ["verified", "source-issue", "corrected"].includes(provenance.status) ||
      provenance.type === "corrected-pdf-error" ||
      provenance.type === "additional-practice",
    `${context} has invalid provenance status/type`,
  );
  if (provenance.pdf) {
    assert(
      provenance.pdf.endsWith(".pdf"),
      `${context} PDF provenance must name a PDF file`,
    );
    assert(
      provenance.page || provenance.pages,
      `${context} PDF provenance must include page or pages`,
    );
  }
}

assert(course.modules.length === 3, "Course should preserve three modules");
assert(topics.length === 9, "Course should preserve nine focused topics");

for (const topic of topics) {
  assert(hasText(topic.id), "Every topic needs an id");
  assert(hasText(topic.number), `${topic.id} needs a number`);
  assert(hasText(topic.title), `${topic.id} needs a title`);
  assert(hasText(topic.hook), `${topic.id} needs a learner-facing hook`);
  assert(Array.isArray(topic.formulas) && topic.formulas.length > 0, `${topic.id} needs formulas`);
  assert(Array.isArray(topic.theory) && topic.theory.length > 0, `${topic.id} needs theory`);
  assert(Array.isArray(topic.examples) && topic.examples.length > 0, `${topic.id} needs worked examples`);
  assert(Array.isArray(topic.practice) && topic.practice.length > 0, `${topic.id} needs active practice`);
  assert(Array.isArray(topic.recap) && topic.recap.length >= 2, `${topic.id} needs a useful recap`);

  for (const formula of topic.formulas) validateMathString(formula, `${topic.id} formula`);
  for (const line of topic.theory) validateMathString(line, `${topic.id} theory`);
  for (const line of topic.recap) validateMathString(line, `${topic.id} recap`);

  for (const [index, example] of topic.examples.entries()) {
    const context = `${topic.id} example ${index + 1} (${example.title})`;
    assert(hasText(example.title), `${context} needs a title`);
    validateMathString(example.problem, `${context} problem`);
    validateSteps(example.steps, context);
    assert(hasText(example.takeaway), `${context} needs a takeaway`);
    validateProvenance(example.provenance, context);
  }

  for (const [index, item] of topic.practice.entries()) {
    const context = `${topic.id} practice ${index + 1} (${item.title})`;
    assert(hasText(item.title), `${context} needs a title`);
    validateMathString(item.problem, `${context} problem`);
    assert(hasText(item.hint), `${context} needs a hint`);
    validateSteps(item.steps, context);
    assert(knownMethods.has(item.method), `${context} uses unknown method: ${item.method}`);
    validateProvenance(item.provenance, context);
  }
}

assert(Array.isArray(course.mixedPractice), "mixedPractice must be an array");
assert(course.mixedPractice.length >= 20, "Mixed practice should draw from the focused practice pool");
for (const [index, item] of course.mixedPractice.entries()) {
  const context = `mixedPractice ${index + 1}`;
  assert(topicIds.has(item.topicId), `${context} references unknown topic ${item.topicId}`);
  validateMathString(item.problem, `${context} problem`);
  assert(hasText(item.hint), `${context} needs a hint`);
  validateSteps(item.steps, context);
  assert(knownMethods.has(item.method), `${context} uses unknown method: ${item.method}`);
}

for (const [dayIndex, day] of course.examSprint.entries()) {
  for (const route of day.routes) {
    assert(
      topicIds.has(route.id) || knownUtilityRoutes.has(route.id),
      `Exam sprint day ${dayIndex + 1} references invalid route ${route.id}`,
    );
  }
}

console.log("Course readiness checks passed.");
