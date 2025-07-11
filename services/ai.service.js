import { pipeline, cos_sim } from "@xenova/transformers";
import { extractJsonSafely } from "../config/utils.js";


// This "Singleton" pattern ensures we only load the heavy AI models once.
const OPENROUTER_API_KEY = "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";
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const model  = "deepseek/deepseek-r1:free"
class AiService {
  static embedder = null;

  static async getEmbedder() {
    if (this.embedder === null) {
      console.log("Loading sentence-embedding model for the first time...");
      // We use a feature-extraction pipeline with a small, efficient model.
      this.embedder = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
    }
    return this.embedder;
  }
}

/**
 * Intelligently maps user-provided CSV headers to a target schema using AI.
 * @param {string[]} userHeaders An array of headers from the user's file (e.g., ['Product Name', 'Cost']).
 * @param {string[]} targetFields An array of the standard fields your system requires (e.g., ['title', 'price']).
 * @returns {Promise<Object>} A promise that resolves to a mapping object (e.g., { title: 'Product Name', price: 'Cost' }).
 */
export async function mapCsvHeaders(userHeaders, targetFields) {
  if (!userHeaders?.length || !targetFields?.length) {
    return {};
  }

  const embedder = await AiService.getEmbedder();

  // 1. Generate embeddings (numerical representations) for both lists of headers.
  const targetEmbeddings = await embedder(targetFields, {
    pooling: "mean",
    normalize: true,
  });
  const userEmbeddings = await embedder(userHeaders, {
    pooling: "mean",
    normalize: true,
  });

  // 2. Calculate the similarity score between every target field and every user header.
  const similarityMatrix = [];
  for (let i = 0; i < targetEmbeddings.dims[0]; ++i) {
    const targetEmbedding = targetEmbeddings.data.slice(
      i * targetEmbeddings.dims[1],
      (i + 1) * targetEmbeddings.dims[1]
    );
    const scores = [];
    for (let j = 0; j < userEmbeddings.dims[0]; ++j) {
      const userEmbedding = userEmbeddings.data.slice(
        j * userEmbeddings.dims[1],
        (j + 1) * userEmbeddings.dims[1]
      );
      scores.push(cos_sim(targetEmbedding, userEmbedding));
    }
    similarityMatrix.push(scores);
  }

  const mapping = {};
  const usedUserHeaderIndices = new Set(); // To prevent mapping one user header to multiple target fields.

  // 3. For each target field, find the user header with the highest similarity score.
  for (let i = 0; i < targetFields.length; i++) {
    const targetField = targetFields[i];
    let bestMatchIndex = -1;
    let bestMatchScore = -1;

    // Find the best match for the current target field among unused user headers.
    similarityMatrix[i].forEach((score, userIndex) => {
      if (score > bestMatchScore && !usedUserHeaderIndices.has(userIndex)) {
        bestMatchScore = score;
        bestMatchIndex = userIndex;
      }
    });

    // 4. If a reasonably good match is found, add it to our mapping.
    if (bestMatchScore > 0.4) {
      // Using a threshold of 0.4 to avoid nonsensical matches.
      mapping[targetField] = userHeaders[bestMatchIndex];
      usedUserHeaderIndices.add(bestMatchIndex); // Mark this header as used.
    } else {
      mapping[targetField] = null;
    }
  }

  return mapping;
}

// NOTE: The 'structureText' function for PDFs would also go in this file.
// It is omitted here to focus on the mapCsvHeaders implementation.
export async function structureText(text) {
  // PDF/Text structuring logic would go here.
  console.log("Structuring text from PDF/URL...");
  return { profile: { name: "Extracted Profile" }, products: [] };
}

export async function extractInfoUsing(cmd, sys) {
  // PDF/Text structuring logic would go here.

  const systemPrompt = sys || `
You are an expert data extractor. 
Your job is to take raw messy text from a vendor's file data and output structured JSON.
Split the information into:
- profile: { companyName, contact, instagram, email, address, bio, keywords }
- products: [ { name, sku, wholesale, retail, description } ]
If a field is missing, use empty string. and only provide the simple json format that ignore all the description or other info provide in response. Provide a single json if there is multiple then bind into 1. like {products,  profile}
`;
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: cmd },
      ],
    }),
  });

  const data = await response.json();  
  const rawText = data.choices[0].message.content;
  return   extractJsonSafely(rawText);   
}
