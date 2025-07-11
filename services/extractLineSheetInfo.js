// import fetch from 'node-fetch'; // If using Node <18

/**
 * Calls OpenRouter DeepSeek R1 to parse raw PDF text.
 * @param {string} extractedText - The raw text you got from pdf-parse/ocr.
 * @returns {Promise<{ profile: object, products: object[] }>}
 */
export async function extractLineSheetInfo(extractedText) {
  const OPENROUTER_API_KEY = "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";
  const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

  const systemPrompt = `
You are an expert data extractor. 
Your job is to take raw messy text from a vendor's line sheet PDF and output structured JSON.
Split the information into:
- profile: { companyName, contact, instagram, email, address, bio, keywords }
- products: [ { name, sku, wholesale, retail, description } ]
If a field is missing, use empty string.
`;

  const userPrompt = `
Here is the raw extracted text from the PDF:
---
${extractedText}
---
Now return only JSON in this format:
{
  "profile": {
    "companyName": "",
    "contact": "",
    "instagram": "",
    "email": "",
    "address": "",
    "bio": "",
    "keywords": ""
  },
  "products": [
    {
      "title": "", //product title/name
      "sku": "",
      "wholesale": "", // product price
      "description": "",
      "qty": "" //min qty required
      "imagesURL":[],
    }
  ]
}
`;

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-r1:free', // or 'deepseek-r1'
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    }),
  });

  const data = await response.json();

  const rawText = data.choices[0].message.content;

  try {
    const structured = JSON.parse(rawText);
    return structured;
  } catch (err) {
    console.error('Failed to parse JSON from model:', rawText);
    throw err;
  }
}
