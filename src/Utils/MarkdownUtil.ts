// markdownUtil.ts
// Utility to convert a structured Markdown test suite into JSON for Interactive Test Suite Manager
// Browser-friendly — works in React without Node.js APIs

export interface Locator {
  element: string;
  locator: string;
}

export interface TestCase {
  id: string;
  title: string;
  category: string;
  expected?: string;
  priority?: string;
  sampleData?: string;
  preconditions?: string;
  locators?: Locator[];
  platforms?: string[];
}

/**
 * Parse a Markdown test suite into JSON format
 * @param markdown Raw markdown string
 * @returns Array of test case objects
 */
export function parseMarkdownToJSON(markdown: string): TestCase[] {
  const lines = markdown.split(/\r?\n/);
  const tests: TestCase[] = [];
  let currentCategory = "";
  let currentTest: Partial<TestCase> | null = null;

  const flushTest = () => {
    if (currentTest) {
      tests.push({
        id: (Date.now() + Math.random()).toString(),
        title: currentTest.title || "",
        category: currentTest.category || currentCategory,
        expected: currentTest.expected || "",
        priority: currentTest.priority || "Medium",
        sampleData: currentTest.sampleData || "",
        preconditions: currentTest.preconditions || "",
        locators:
          currentTest.locators || [
            { element: currentTest.title || "", locator: "" },
          ],
        platforms: currentTest.platforms || ["Android"],
      });
    }
    currentTest = null;
  };

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    // Detect category headings
    const categoryMatch = /^#{1,3}\s+(.*)/.exec(trimmedLine);
    if (categoryMatch) {
      flushTest();
      currentCategory = categoryMatch[1].trim();
      return;
    }

    // Detect new test case start
    const testMatch = /^[-*]\s+(.+)/.exec(trimmedLine);
    if (testMatch) {
      flushTest();
      currentTest = {
        title: testMatch[1].trim(),
        category: currentCategory,
      };
      return;
    }

    if (/^Expected\s*Result:/i.test(trimmedLine)) {
      currentTest && (currentTest.expected = trimmedLine.split(":")[1]?.trim() || "");
    }
    if (/^Priority/i.test(trimmedLine)) {
      currentTest && (currentTest.priority = trimmedLine.split(":")[1]?.trim() || "");
    }
    if (/^Sample\s*Data/i.test(trimmedLine)) {
      currentTest && (currentTest.sampleData = trimmedLine.split(":")[1]?.trim() || "");
    }
    if (/^Preconditions/i.test(trimmedLine)) {
      currentTest && (currentTest.preconditions = trimmedLine.split(":")[1]?.trim() || "");
    }
    if (/^Locators/i.test(trimmedLine)) {
      const loc = trimmedLine.split(":")[1]?.trim() || "";
      currentTest &&
        (currentTest.locators = [
          { element: currentTest.title || "", locator: loc },
        ]);
    }
    if (/^Platforms/i.test(trimmedLine)) {
      currentTest &&
        (currentTest.platforms =
          trimmedLine
            .split(":")[1]
            ?.split(",")
            .map((p) => p.trim()) || ["Android"]);
    }
  });

  flushTest();
  console.log("Parsed Test Cases:", tests);
  return tests;
}
