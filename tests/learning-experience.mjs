import { readFileSync } from "node:fs";
import { loadCourse, assert } from "./helpers/load-course.mjs";

const app = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../css/style.css", import.meta.url), "utf8");
const course = loadCourse();
const topicIds = course.modules.flatMap((module) => module.topics.map((topic) => topic.id));

for (const phrase of [
  "Tiny Idea",
  "Paper Mission",
  "Steal the move",
  "Your first attempt",
  "More solved examples",
  "More paper practice",
  "Do not try to love this topic",
  "Need a nudge",
  "Show worked answer",
  "Show next tiny step",
]) {
  assert(app.includes(phrase), `Learning UI is missing friendly phrase: ${phrase}`);
}

assert(app.includes("function topicCoachLine"), "App must provide topic-level coach lines");
for (const topicId of topicIds) {
  assert(app.includes(`"${topicId}"`), `Missing coach line for topic: ${topicId}`);
}

assert(
  app.includes("const firstExample = examples[0]") &&
    app.includes("const firstPractice = practice[0]") &&
    app.includes("remainingExamples") &&
    app.includes("remainingPractice"),
  "Topic pages must use watch-one, try-one, then continue ordering",
);

assert(css.includes(".coach-note"), "CSS must style coach notes");

console.log("Learning experience checks passed.");
