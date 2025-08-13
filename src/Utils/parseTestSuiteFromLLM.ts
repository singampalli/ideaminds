// utils/parseTestSuiteFromLLM.ts

export interface TestCase {
  id: string;
  category: string;
  title: string;
  expectedResult: string;
  priority: "P0" | "P1" | "P2" | "P3";
  sampleData: string;
  platforms: string[];
  preconditions: string;
  locators: {
    id?: string;
    accessibilityLabel?: string;
    xpath?: string;
  };
  deviceMatrix: string[];
}
export function parseLLMJsonArray(raw: string): TestCase[] {
  try {
    // Remove any surrounding quotes or escape characters
    const cleaned = raw
      .replace(/^"+|"+$/g, "") // remove leading/trailing quotes
      .replace(/\\"/g, '"') // unescape inner quotes
      .replace(/\\n/g, "") // remove newline escapes
      .replace(/\\t/g, "") // remove tab escapes
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
      throw new Error("Parsed data is not an array");
    }

    return parsed as TestCase[];
  } catch (error) {
    console.error("Failed to parse LLM JSON array:", error);
    return [];
  }
}
function fixMalformedFields(jsonStr: string): string {
  return (
    jsonStr
      // Fix sampleData fields
      .replace(/"sampleData":\s*"([^"]*:[^"]*)"/g, (match, inner) => {
        const escaped = inner.replace(/"/g, '\\"');
        return `"sampleData": "${escaped}"`;
      })
      // Fix accessibilityLabel fields
      .replace(/"accessibilityLabel":\s*"([^"]*:[^"]*)"/g, (match, inner) => {
        const escaped = inner.replace(/"/g, '\\"');
        return `"accessibilityLabel": "${escaped}"`;
      })
  );
}
export function getJson(raw: string): TestCase[] {
  try {
    let cleaned = raw.trim();

    // Remove markdown if present
    cleaned = cleaned
      .replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    // Fix malformed inner quotes in sampleData and accessibilityLabel
    cleaned = cleaned.replace(
      /""([^"]+)"":\s*"([^"]+)"(?:,\s*"([^"]+)":\s*"([^"]+)")?""/g,
      (_, k1, v1, k2, v2) => {
        const obj: Record<string, string> = {};
        obj[k1] = v1;
        if (k2 && v2) obj[k2] = v2;
        return JSON.stringify(obj);
      }
    );

    // Fix simpler malformed sampleData strings
    cleaned = cleaned.replace(
      /"sampleData":\s*"([^"]*:[^"]*)"/g,
      (_, inner) => {
        const fixed = `{${inner}}`.replace(/"/g, '\\"');
        return `"sampleData": "${fixed}"`;
      }
    );
    console.log(cleaned);
    // Parse JSON
    const parsed = JSON.parse(cleaned);
    console.log("Parsed JSON:", parsed);
    // Normalize sampleData into objects
    parsed.forEach((tc: any) => {
      if (typeof tc.sampleData === "string") {
        try {
          tc.sampleData = JSON.parse(tc.sampleData.replace(/\\"/g, '"'));
        } catch {
          tc.sampleData = {};
        }
      }
    });

    return parsed as TestCase[];
  } catch (error) {
    console.error("❌ Failed to parse test cases:", error.message);
    return [];
  }
}
export function parseTestSuiteFromLLM(raw: string): TestCase[] {
  try {
    // const parsed = getJson(raw);
    console.log(typeof raw);
    console.log(raw);
    // Step 3: Validate structure (basic check)
    if (!Array.isArray(raw)) {
      throw new Error("Parsed data is not an array");
    }

    // Optional: You can add stricter validation here using zod or yup

    return parsed as TestCase[];
  } catch (error) {
    console.error("Failed to parse LLM test suite:", error);
    return [];
  }
}
