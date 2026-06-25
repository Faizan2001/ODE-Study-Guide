import { assert, loadCourse } from "./helpers/load-course.mjs";

const course = loadCourse();
const topics = new Map(
  course.modules.flatMap((module) =>
    module.topics.map((topic) => [topic.id, topic]),
  ),
);

const chapter13Topics = [
  "functions-many-vars",
  "limits-continuity",
  "partial-derivatives",
  "chain-rule",
  "directional-gradients",
  "tangent-planes",
  "maxima-minima",
].map((id) => {
  const topic = topics.get(id);
  assert(topic, `Missing Chapter 13 topic ${id}`);
  return topic;
});

for (const topic of chapter13Topics) {
  for (const example of topic.examples) {
    assert(
      example.provenance?.pdf === "Chapter 13.pdf",
      `Missing Chapter 13 provenance for ${example.title}`,
    );
    assert(
      example.provenance?.status === "verified",
      `Unverified Chapter 13 example: ${example.title}`,
    );
  }
}

const directional = topics.get("directional-gradients");
const directionalDefinition = directional.examples.find(
  (example) => example.title === "Directional derivative Example 1",
);
assert(directionalDefinition, "Missing Chapter 13.6 Example 1");
assert(
  directionalDefinition.problem.includes("f(x,y)=xy") &&
    directionalDefinition.problem.includes("(1,2)") &&
    directionalDefinition.problem.includes(String.raw`\frac{\sqrt3}{2}`),
  "Chapter 13.6 Example 1 no longer matches the PDF",
);
assert(
  directionalDefinition.steps.some((step) =>
    step.math.includes(String.raw`\frac12+\sqrt3`),
  ),
  "Chapter 13.6 Example 1 must obtain 1/2 + sqrt(3)",
);

const extrema = topics.get("maxima-minima");
const extremaExample3 = extrema.examples.find(
  (example) => example.title === "Max/min Example 3",
);
assert(extremaExample3, "Missing Chapter 13.8 Example 3");
assert(
  extremaExample3.problem.includes(String.raw`3x^2-2xy+y^2-8y`),
  "Chapter 13.8 Example 3 no longer matches the PDF",
);
assert(
  extremaExample3.steps.some(
    (step) => step.math.includes("(2,6)") && step.math.includes("minimum"),
  ),
  "Chapter 13.8 Example 3 must classify (2,6) as a relative minimum",
);

const polarLimit = topics
  .get("limits-continuity")
  .examples.find((example) => example.title.startsWith("Example 7"));
assert(polarLimit, "Missing Chapter 13.2 Example 7");
assert(
  polarLimit.steps.some((step) =>
    step.why.includes("infinity-over-infinity"),
  ),
  "Chapter 13.2 Example 7 must correctly identify the L'Hopital form",
);
assert(
  !polarLimit.steps.some((step) => step.why.includes("0/0")),
  "Chapter 13.2 Example 7 must not call the form 0/0",
);

const tangent = topics.get("tangent-planes");
assert(
  tangent.examples.some((example) =>
    example.steps.some((step) => step.math.includes("x+8y+z=18")),
  ),
  "Chapter 13.7 Example 1 must show its simplified tangent plane",
);
assert(
  tangent.examples.some((example) =>
    example.steps.some((step) => step.math.includes("-4x-4y+z=-8")),
  ),
  "Chapter 13.7 Example 2 must show its simplified tangent plane",
);

for (const exerciseNumber of [1, 2, 3, 5, 10, 11, 12]) {
  const practice = tangent.practice.find((item) =>
    item.title.startsWith(`Exercise 13.7 #${exerciseNumber}`),
  );
  assert(practice, `Missing marked Exercise 13.7 #${exerciseNumber}`);
  assert(
    practice.provenance?.pdf === "Chapter 13.pdf" &&
      practice.provenance?.type === "pdf-assigned-exercise" &&
      practice.provenance?.status === "verified",
    `Exercise 13.7 #${exerciseNumber} must have verified PDF provenance`,
  );
}

console.log("Chapter 13 coverage checks passed.");
