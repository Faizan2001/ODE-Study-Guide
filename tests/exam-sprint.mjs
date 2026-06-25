import { loadCourse, assert } from "./helpers/load-course.mjs";
import { readFileSync } from "node:fs";

const course = loadCourse();
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const topics = course.modules.flatMap((module) => module.topics);
const topicIds = new Set(topics.map((topic) => topic.id));
const utilityRoutes = new Set(["mixed", "formulas", "decision-tree"]);
const allowedRoutes = new Set([...topicIds, ...utilityRoutes]);

assert(Array.isArray(course.examSprint), "course.examSprint must be an array");
assert(course.examSprint.length === 7, "Exam sprint must contain exactly seven days");

const requiredRoutes = [
  "calc-integration",
  "integration-by-parts",
  "trig-integrals",
  "trig-substitution",
  "partial-fractions",
  "ode-separable",
  "ode-linear",
  "ode-exact",
  "ode-bernoulli",
  "partial-derivatives",
  "directional-gradients",
  "tangent-planes",
  "maxima-minima",
  "mixed",
  "formulas",
  "decision-tree",
];

const allSprintText = [];
const allSprintRoutes = [];
let paperFirstDays = 0;
let mixedPracticeDays = 0;

for (const [index, day] of course.examSprint.entries()) {
  assert(day.day === index + 1, `Sprint day ${index + 1} must have matching day number`);
  assert(day.title && day.title.length >= 6, `Sprint day ${day.day} needs a descriptive title`);
  assert(day.timeBox && /\d/.test(day.timeBox), `Sprint day ${day.day} needs a realistic time box`);
  assert(day.why && day.why.length >= 20, `Sprint day ${day.day} needs a why explanation`);
  assert(Array.isArray(day.tasks), `Sprint day ${day.day} tasks must be an array`);
  assert(day.tasks.length >= 4, `Sprint day ${day.day} should have at least four tasks`);
  assert(day.tasks.length <= 6, `Sprint day ${day.day} should stay compact with at most six tasks`);
  assert(Array.isArray(day.routes), `Sprint day ${day.day} routes must be an array`);
  assert(day.routes.length >= 2, `Sprint day ${day.day} should link to at least two study routes`);
  assert(day.checkpoint && day.checkpoint.length >= 20, `Sprint day ${day.day} needs an active checkpoint`);

  const text = [day.title, day.timeBox, day.why, day.checkpoint, ...day.tasks].join("\n");
  allSprintText.push(text);
  if (/paper|notebook|write/i.test(text)) paperFirstDays += 1;
  if (/mixed/i.test(text)) mixedPracticeDays += 1;

  for (const route of day.routes) {
    const routeId = typeof route === "string" ? route : route.id;
    assert(routeId, `Sprint day ${day.day} contains an empty route chip`);
    assert(allowedRoutes.has(routeId), `Sprint day ${day.day} references unknown route: ${routeId}`);
    allSprintRoutes.push(routeId);
  }
}

for (const route of requiredRoutes) {
  assert(allSprintRoutes.includes(route), `Exam sprint must include high-yield route: ${route}`);
}

assert(paperFirstDays >= 4, "Exam sprint should require paper/notebook work on at least four days");
assert(mixedPracticeDays >= 3, "Exam sprint should include mixed-practice work on at least three days");
assert(allSprintText.join("\n").includes("confidence"), "Exam sprint should include confidence checks");

const html = read("index.html");
const app = read("js/app.js");
const css = read("css/style.css");

assert(html.includes('data-route="exam-sprint"'), "Sidebar utilities must link to the Exam Sprint route");
assert(html.includes("Exam Sprint"), "Sidebar utilities must label the Exam Sprint route");
assert(app.includes("function renderExamSprint"), "app.js must define renderExamSprint");
assert(app.includes('current === "exam-sprint"'), "renderRoute must dispatch the Exam Sprint route");
assert(css.includes(".sprint-grid"), "style.css must style the sprint grid");
assert(css.includes(".sprint-task-list"), "style.css must style sprint task lists");

console.log("Exam sprint checks passed.");
