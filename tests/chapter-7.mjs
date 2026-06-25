import { assert, loadCourse } from "./helpers/load-course.mjs";

const course = loadCourse();
const topics = new Map(
  course.modules.flatMap((module) =>
    module.topics.map((topic) => [topic.id, topic]),
  ),
);

const byParts = topics.get("integration-by-parts");
const trig = topics.get("trig-integrals");
const trigSub = topics.get("trig-substitution");
const partialFractions = topics.get("partial-fractions");

for (const [id, topic] of [
  ["integration-by-parts", byParts],
  ["trig-integrals", trig],
  ["trig-substitution", trigSub],
  ["partial-fractions", partialFractions],
]) {
  assert(topic, `Missing Chapter 7 topic ${id}`);
}

const inverseTangent = byParts.examples.find(
  (example) => example.title === "Example 6: inverse tangent",
);
assert(inverseTangent, "Missing the printed Chapter 7.2 Example 6");
assert(
  inverseTangent.provenance?.note?.includes("solution"),
  "Example 6 must disclose that the PDF solution inserts bounds",
);
assert(
  inverseTangent.provenance?.definiteVariant ===
    String.raw`\frac{\pi}{4}-\frac12\ln2`,
  "Example 6 must record the PDF solution's definite variant",
);

const arcLength = trigSub.examples.find((example) =>
  example.title.startsWith("Example 4: arc length"),
);
assert(arcLength, "Missing Chapter 7.4 Example 4");
const secantCubedFormulaSteps = arcLength.steps.filter((step) =>
  step.math.includes(String.raw`\int\sec^3\theta\,d\theta=`),
);
assert(
  secantCubedFormulaSteps.length === 1,
  `Arc-length example must contain one secant-cubed formula step, received ${secantCubedFormulaSteps.length}`,
);

const assigned33 = trigSub.practice.find((practice) =>
  practice.title.includes("#33"),
);
const assigned34 = trigSub.practice.find((practice) =>
  practice.title.includes("#34"),
);
assert(assigned33, "Missing assigned Exercise 7.4 #33");
assert(assigned34, "Missing assigned Exercise 7.4 #34");
for (const practice of [assigned33, assigned34]) {
  assert(
    practice.provenance?.type === "pdf-assigned-exercise",
    `${practice.title} must be labeled as an assigned PDF exercise`,
  );
}

assert(
  trig.practice.some((practice) => practice.method === "tangent/secant integral"),
  "Trigonometric-integral practice must include tangent/secant recognition",
);

const fractionMethods = new Set(
  partialFractions.practice.map((practice) => practice.method),
);
for (const method of [
  "partial fractions: distinct",
  "partial fractions: repeated",
  "partial fractions: irreducible quadratic",
  "partial fractions: improper",
]) {
  assert(fractionMethods.has(method), `Missing practice pattern: ${method}`);
}

const chapter7Examples = [
  ...byParts.examples,
  ...trig.examples,
  ...trigSub.examples,
  ...partialFractions.examples,
];
for (const example of chapter7Examples) {
  assert(
    example.provenance?.pdf === "Chapter 7.pdf",
    `Missing Chapter 7 provenance for ${example.title}`,
  );
  assert(
    example.provenance?.status === "verified",
    `Unverified Chapter 7 example: ${example.title}`,
  );
}

console.log("Chapter 7 coverage checks passed.");
