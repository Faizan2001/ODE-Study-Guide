import { assert, findExample, loadCourse } from "./helpers/load-course.mjs";

const course = loadCourse();

const inverseTangent = findExample(course, "Example 6: inverse tangent");
assert(inverseTangent, "Missing Chapter 7.2 Example 6");
assert(
  inverseTangent.problem.includes(String.raw`\int \tan^{-1}x\,dx`),
  "Chapter 7.2 Example 6 must be the PDF's indefinite integral",
);
assert(
  !inverseTangent.problem.includes("_0^1"),
  "Chapter 7.2 Example 6 must not invent definite bounds",
);
assert(
  inverseTangent.steps
    .at(-1)
    .math.includes(String.raw`x\tan^{-1}x-\frac12\ln(1+x^2)+C`),
  "Chapter 7.2 Example 6 must have the correct antiderivative",
);
assert(
  inverseTangent.provenance?.page === 4 &&
    inverseTangent.provenance?.label === "Example 6",
  "Chapter 7.2 Example 6 requires page-level provenance",
);

const completingSquare = findExample(
  course,
  "Example 5 (printed label repeated): completing the square",
);
assert(completingSquare, "Missing Chapter 7.4 repeated Example 5");
assert(
  completingSquare.provenance?.note.includes("repeats"),
  "Repeated PDF numbering must be disclosed",
);

const partialContinuity = findExample(
  course,
  "Example 9: partials without continuity",
);
assert(partialContinuity, "Missing Chapter 13.3 Example 9");
assert(
  partialContinuity.problem.includes(String.raw`-\frac{xy}{x^2+y^2}`),
  "Chapter 13.3 Example 9 must preserve the PDF's negative sign",
);
assert(
  partialContinuity.steps.some((step) =>
    step.math.includes(String.raw`f(x,x)`) &&
    step.math.includes(String.raw`=-\frac12`),
  ),
  "Chapter 13.3 Example 9 path value must preserve the negative sign",
);

console.log("Content regression checks passed.");
