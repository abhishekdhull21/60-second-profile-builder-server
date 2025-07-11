
/**
 * Extracts and parses JSON from a string or regex match.
 * Supports fenced ```json blocks or plain JSON text.
 * @param {string|Array} raw - The raw model response or regex match array.
 * @returns {Object} - Parsed JSON object.
 */
export function extractJsonSafely(raw) {
  let jsonString;

  if (Array.isArray(raw)) {
    // You passed the regex match array
    if (raw[1]) {
      jsonString = raw[1];
    } else {
      throw new Error(" No JSON found in match group.");
    }
  } else {
    // Raw string input — try to find ```json fenced block
    const fenced = raw.match(/```json\s*([\s\S]*?)```/i);
    if (fenced && fenced[1]) {
      jsonString = fenced[1];
    } else {
      // Fallback: use raw as-is if no fencing found
      jsonString = raw.trim();
    }
  }

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Failed to parse JSON:", jsonString);
    throw err;
  }
}
