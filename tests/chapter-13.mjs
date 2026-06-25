import { assert, loadCourse } from "./helpers/load-course.mjs";

const course = loadCourse();
const topics = new Map(
  course.modules.flatMap((module) =>
    module.topics.map((topic) => [topic.id, topic]),
  ),
);

const chapter13Topics = [
  "partial-derivatives",
  "chain-rule",
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

console.log("Chapter 13 coverage checks passed.");
