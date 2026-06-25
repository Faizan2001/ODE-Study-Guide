import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const ledgerPath = path.join(root, "audit/pdf-ledger.json");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(fs.existsSync(ledgerPath), "Missing audit/pdf-ledger.json");

const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
const expected = new Map([
  ["chapter-7", 30],
  ["chapter-13", 55],
  ["chapter-1", 26],
  ["chapter-2", 15],
]);
const allowedStatuses = new Set(["pending", "reviewed", "issue"]);
const pages = ledger.pdfs.flatMap((pdf) =>
  pdf.pages.map((page) => ({ ...page, pdfId: pdf.id })),
);

assert(ledger.version === 1, "Ledger version must be 1");
assert(pages.length === 126, `Expected 126 page records, received ${pages.length}`);

for (const pdf of ledger.pdfs) {
  assert(expected.get(pdf.id) === pdf.pageCount, `Wrong page count for ${pdf.id}`);
  assert(pdf.pages.length === pdf.pageCount, `Missing page records for ${pdf.id}`);
  assert(
    new Set(pdf.pages.map((page) => page.page)).size === pdf.pageCount,
    `Duplicate page records for ${pdf.id}`,
  );
}

for (const page of pages) {
  assert(
    allowedStatuses.has(page.status),
    `Invalid status for ${page.pdfId} page ${page.page}`,
  );
  assert(
    typeof page.scope === "string" && page.scope.length > 0,
    `Missing scope for ${page.pdfId} page ${page.page}`,
  );
  if (page.status !== "pending") {
    assert(
      Array.isArray(page.evidence) && page.evidence.length > 0,
      `Reviewed page lacks evidence: ${page.pdfId} page ${page.page}`,
    );
  }
}

const chapter7 = ledger.pdfs.find((pdf) => pdf.id === "chapter-7");
assert(chapter7, "Missing Chapter 7 ledger");
for (const page of chapter7.pages) {
  assert(
    page.status === "reviewed" || page.status === "issue",
    `Chapter 7 page ${page.page} has not been visually reviewed`,
  );
  assert(
    typeof page.summary === "string" && page.summary.length > 0,
    `Chapter 7 page ${page.page} lacks a page-specific summary`,
  );
  assert(
    typeof page.courseDecision === "string" && page.courseDecision.length > 0,
    `Chapter 7 page ${page.page} lacks a course decision`,
  );
}

for (const pdfId of ["chapter-1", "chapter-2", "chapter-13"]) {
  const pdf = ledger.pdfs.find((item) => item.id === pdfId);
  assert(pdf, `Missing ${pdfId} ledger`);
  for (const page of pdf.pages) {
    assert(
      page.status === "reviewed" || page.status === "issue",
      `${pdfId} page ${page.page} has not been visually reviewed`,
    );
    assert(
      typeof page.summary === "string" && page.summary.length > 0,
      `${pdfId} page ${page.page} lacks a page-specific summary`,
    );
    assert(
      typeof page.courseDecision === "string" &&
        page.courseDecision.length > 0,
      `${pdfId} page ${page.page} lacks a course decision`,
    );
  }
}

console.log("Audit ledger checks passed.");
