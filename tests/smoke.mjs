import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const requiredFiles = [
  "index.html",
  "css/style.css",
  "js/content.js",
  "js/progress.js",
  "js/katex-render.js",
  "js/practice.js",
  "js/decision-tree.js",
  "js/app.js",
];

for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(root, file)), `Missing required file: ${file}`);
}

const context = {
  window: {},
  console,
};
vm.createContext(context);
vm.runInContext(read("js/content.js"), context, { filename: "content.js" });

const content = context.window.ODE_COURSE;
assert(content, "window.ODE_COURSE must be defined");
assert(Array.isArray(content.modules), "Course modules must be an array");
assert(content.modules.length >= 5, "Course must include Module 0 through Module 4");

const topicIds = content.modules.flatMap((module) => module.topics.map((topic) => topic.id));
[
  "calc-differentiation",
  "integration-by-parts",
  "ode-separable",
  "ode-linear",
  "ode-exact",
  "ode-bernoulli",
  "partial-derivatives",
  "directional-gradients",
  "maxima-minima",
].forEach((id) => assert(topicIds.includes(id), `Missing required topic: ${id}`));

const allExamples = content.modules.flatMap((module) =>
  module.topics.flatMap((topic) => topic.examples || [])
);
const allPractice = content.modules.flatMap((module) =>
  module.topics.flatMap((topic) => topic.practice || [])
);

assert(allExamples.length >= 40, "Expected at least 40 worked examples");
assert(allPractice.length >= 25, "Expected at least 25 practice problems");
assert(content.formulas.length >= 35, "Expected a comprehensive formula sheet");
assert(content.mixedPractice.length >= 20, "Expected mixed practice pool");

const formulaText = content.formulas.map((item) => item.formula).join("\n");
[
  "\\int u\\,dv = uv - \\int v\\,du",
  "\\mu(x)=e^{\\int P(x)\\,dx}",
  "\\frac{\\partial M}{\\partial y}=\\frac{\\partial N}{\\partial x}",
  "u=y^{1-n}",
  "D=f_{xx}f_{yy}-(f_{xy})^2",
].forEach((formula) => assert(formulaText.includes(formula), `Missing formula: ${formula}`));

const problemText = allExamples.map((example) => example.problem)
  .concat(allPractice.map((practice) => practice.problem))
  .join("\n");
const allSteps = allExamples.flatMap((example) => example.steps || [])
  .concat(allPractice.flatMap((practice) => practice.steps || []));
const allStepsMathAndWhy = allSteps.flatMap((step) => [step.math, step.why]).join("\n");
const allTakeaways = allExamples.map((example) => example.takeaway || "").join("\n");
const allHints = allPractice.map((practice) => practice.hint || "").join("\n");
const allRawStrings = [
  problemText,
  allStepsMathAndWhy,
  allTakeaways,
  allHints,
].join("\n");

[
  String.raw`\int x\cos x\,dx`,
  String.raw`\int \tan^{-1}x\,dx`,
  String.raw`\int \tan^2x\sec^4x\,dx`,
  String.raw`\int \tan^3x\sec^3x\,dx`,
  String.raw`\int \tan^2x\sec x\,dx`,
  String.raw`\int\frac{\sqrt{x^2-25}}{x}\,dx`,
  String.raw`\int\frac{dx}{x^2+x-2}`,
  String.raw`\int\frac{2x+4}{x^3-2x^2}\,dx`,
  String.raw`\int\frac{x^2+x-2}{3x^3-x^2+3x-1}\,dx`,
  String.raw`\int\frac{3x^4+3x^3-5x^2+x-1}{x^2+x-2}\,dx`,
].forEach((problem) => assert(problemText.includes(problem), `Missing PDF-aligned problem: ${problem}`));

// Verify arc length integral appears in steps (not problem field)
assert(allRawStrings.includes(String.raw`\int_0^1\sqrt{1+x^2}`), "Chapter 7.4 Example 4 must include arc length integral in steps");
// Verify the negative sign in Ch 13.2 limit example
assert(allRawStrings.includes(String.raw`-\frac{xy}{x^2+y^2}`), "Chapter 13.2 path limits must have negative sign");

// Chapter 7.2 Example 8 (cosine reduction formula)
assert(allRawStrings.includes(String.raw`\frac{1}{4}\cos^3x\sin x + \frac{3}{8}\cos x\sin x + \frac{3}{8}x`), "Chapter 7.2 Example 8 must use reduction formula antiderivative");

// Chapter 7.4 Example 3 (ellipse area)
assert(allRawStrings.includes(String.raw`\frac{x^2}{a^2}+\frac{y^2}{b^2}=1`), "Chapter 7.4 Example 3 must define the ellipse equation");
assert(allRawStrings.includes(String.raw`\pi ab`), "Chapter 7.4 Example 3 must evaluate to pi * a * b");

// Chapter 7.4's second printed Example 5 (completing the square)
assert(allRawStrings.includes(String.raw`\int\frac{x}{x^2-4x+8}\,dx`), "Chapter 7.4 repeated Example 5 completing-the-square problem must be present");
assert(allRawStrings.includes(String.raw`\frac{1}{2}\ln[(x-2)^2+4]`), "Chapter 7.4 repeated Example 5 steps must show the logarithm component");

// Chapter 13.2 Examples 2-7
assert(allRawStrings.includes(String.raw`5x^3y^2-9`), "Chapter 13.2 Example 2 limit function must be present");
assert(allRawStrings.includes(String.raw`\sin(3x^2y^5)`), "Chapter 13.2 Example 4 continuity composition must be present");
assert(allRawStrings.includes(String.raw`(x^2+y^2)\ln(x^2+y^2)`), "Chapter 13.2 Example 7 polar limit must be present");

// Chapter 13.3 Example 12
assert(allRawStrings.includes(String.raw`x^2y^3+x^4y`), "Chapter 13.3 Example 12 must use the exact PDF function x^2y^3+x^4y");

// Chapter 13.7 Example 1(c) tangent plane angle
assert(allRawStrings.includes(String.raw`\cos^{-1}\left(\frac{1}{\sqrt{66}}\right) \approx 83^\circ`), "Chapter 13.7 Example 1(c) must show the correct angle calculation");

// Practice Exercises 1.2 #4 and #8
assert(allRawStrings.includes(String.raw`y' + 2xy^2 = 0`), "Practice Exercise 1.2 #4 must be present");
assert(allRawStrings.includes(String.raw`x'' + x = 0`), "Practice Exercise 1.2 #8 must be present");

assert(!allRawStrings.includes(String.raw`\tan^{-1}1=\pi=`), "Separable Exercise 23 must not state arctan(1)=pi");
assert(!problemText.includes(String.raw`\int_0^1 \tan^{-1}x\,dx`), "Chapter 7.2 Example 6 must not invent definite bounds");
assert(!problemText.includes(String.raw`\int\frac{dx}{\sqrt{x^2+9}}`), "Chapter 7.4 Example 4 must not use a non-PDF substitute problem");
assert(!problemText.includes(String.raw`\int\frac{\sqrt{x^2-4}}{x}\,dx`), "Chapter 7.4 Example 5 must not use a non-PDF substitute problem");

const html = read("index.html");
assert(html.includes("katex"), "index.html must load KaTeX");
assert(html.includes("js/app.js"), "index.html must load app.js");

const app = read("js/app.js");
assert(app.includes("keydown"), "App must include keyboard navigation");
assert(app.includes("localStorage"), "App must persist progress");

console.log("Smoke checks passed.");
