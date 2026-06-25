import { assert, loadCourse } from "./helpers/load-course.mjs";

const course = loadCourse();
const topics = new Map(
  course.modules.flatMap((module) =>
    module.topics.map((topic) => [topic.id, topic]),
  ),
);

const separable = topics.get("ode-separable");
const linear = topics.get("ode-linear");
const linearModels = topics.get("ode-linear-models");

for (const [id, topic] of [
  ["ode-separable", separable],
  ["ode-linear", linear],
  ["ode-linear-models", linearModels],
]) {
  assert(topic, `Missing ODE topic ${id}`);
}

const allPdfItems = [
  ...separable.examples,
  ...linear.examples,
  ...linearModels.examples,
];
for (const item of allPdfItems) {
  assert(item.provenance?.pdf, `Missing PDF provenance: ${item.title}`);
  assert(
    item.provenance?.status === "verified",
    `Unverified PDF item: ${item.title}`,
  );
}

const exercise25 = separable.examples.find((example) =>
  example.title.startsWith("Exercise 25"),
);
assert(exercise25, "Missing separable Exercise 25");
assert(
  exercise25.steps.some((step) => step.math.includes("(-\\infty,0)")),
  "Separable Exercise 25 must include maximal interval (-infinity, 0)",
);

const linear9 = linear.examples.find(
  (example) => example.title === "Exercise 9",
);
assert(linear9, "Missing linear Exercise 9");
assert(
  linear9.provenance?.note?.includes("(0,∞)"),
  "Linear Exercise 9 must disclose the PDF's interval convention",
);

console.log("Chapters 1–2 coverage checks passed.");
