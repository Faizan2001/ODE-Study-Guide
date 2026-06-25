import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "../..");

export function loadCourse() {
  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(path.join(root, "js/content.js"), "utf8"),
    context,
    { filename: "js/content.js" },
  );
  if (!context.window.ODE_COURSE) {
    throw new Error("window.ODE_COURSE was not created");
  }
  return context.window.ODE_COURSE;
}

export function allExamples(course) {
  return course.modules.flatMap((module) =>
    module.topics.flatMap((topic) =>
      (topic.examples || []).map((example) => ({
        ...example,
        topicId: topic.id,
      })),
    ),
  );
}

export function findExample(course, title) {
  return allExamples(course).find((example) => example.title === title);
}

export function assert(condition, message) {
  if (!condition) throw new Error(message);
}
