import { assert, loadCourse } from "./helpers/load-course.mjs";

const course = loadCourse();
const topics = new Map(
  course.modules.flatMap((module) =>
    module.topics.map((topic) => [topic.id, topic]),
  ),
);

const terminology = topics.get("de-terminology");
const ivp = topics.get("ivp");
const models = topics.get("models");
const separable = topics.get("ode-separable");
const linear = topics.get("ode-linear");
const exact = topics.get("ode-exact");
const bernoulli = topics.get("ode-bernoulli");
const linearModels = topics.get("ode-linear-models");

for (const [id, topic] of [
  ["de-terminology", terminology],
  ["ivp", ivp],
  ["models", models],
  ["ode-separable", separable],
  ["ode-linear", linear],
  ["ode-exact", exact],
  ["ode-bernoulli", bernoulli],
  ["ode-linear-models", linearModels],
]) {
  assert(topic, `Missing ODE topic ${id}`);
}

const allPdfItems = [
  ...terminology.examples,
  ...ivp.examples,
  ...separable.examples,
  ...linear.examples,
  ...exact.examples,
  ...bernoulli.examples,
  ...linearModels.examples,
];
for (const item of allPdfItems) {
  assert(item.provenance?.pdf, `Missing PDF provenance: ${item.title}`);
  assert(
    item.provenance?.status === "verified",
    `Unverified PDF item: ${item.title}`,
  );
}

const badExercise = terminology.examples.find((example) =>
  example.title.startsWith("Exercise 11"),
);
assert(badExercise, "Missing Chapter 1 Exercise 11");
assert(
  badExercise.provenance?.type === "corrected-pdf-error",
  "Exercise 11 must be labeled as a corrected PDF error",
);

for (const title of ["Exercise 1.2 #3", "Exercise 1.2 #4"]) {
  const practice = ivp.practice.find((item) => item.title === title);
  assert(practice, `Missing ${title}`);
  assert(
    practice.steps.some((step) => step.math.includes("I=") || step.math.includes("I =")),
    `${title} must state the maximal solution interval`,
  );
}

assert(
  models.theory.some((line) =>
    line.toLowerCase().includes("coordinate convention"),
  ),
  "Falling-body teaching must declare a coordinate convention",
);
const modelNames = new Set(models.modelRows.map((row) => row[0]));
for (const modelName of [
  "Malthusian population",
  "Logistic population",
  "Radioactive decay",
  "Newton cooling/warming",
  "Spread of disease",
  "Chemical reaction",
  "Mixing",
  "Series circuit",
  "Falling bodies",
  "Simple harmonic motion",
  "Damped harmonic motion",
]) {
  assert(modelNames.has(modelName), `Missing model family: ${modelName}`);
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

assert(
  exact.theory.some((line) => line.includes("M_y") && line.includes("N_x")),
  "Exact equations need an on-page partial-derivative mini-review",
);

for (const [topic, title, problemFragment] of [
  [exact, "Exercise 3", String.raw`(5x+4y)dx+(4x-8y^3)dy=0`],
  [exact, "Exercise 33: integrating factor", String.raw`6xy\,dx+(4y+9x^2)dy=0`],
  [bernoulli, "Exercise 15", String.raw`x\frac{dy}{dx}+y=\frac{1}{y^2}`],
  [bernoulli, "Exercise 18", String.raw`x\frac{dy}{dx}-(1+x)y=xy^2`],
]) {
  const example = topic.examples.find((item) => item.title === title);
  assert(example, `Missing ${title}`);
  assert(
    example.problem.includes(problemFragment),
    `${title} no longer matches the printed equation`,
  );
}

console.log("Chapters 1–2 coverage checks passed.");
