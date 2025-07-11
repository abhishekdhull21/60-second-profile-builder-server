import fs from "fs";
import csv from "csv-parser";
import xlsx from "xlsx";
import { extractInfoUsing, mapCsvHeaders } from "./ai.service.js";
import PDFParser from "pdf2json";

// pdfjsLib.GlobalWorkerOptions.workerSrc = `pdfjs-dist/legacy/build/pdf.worker.js`;

export async function parseCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    let headers = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("headers", (h) => (headers = h))
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          // const mapping = await mapCsvHeaders(headers, [
          //   "title",
          //   "description",
          //   "email",
          //   "address",
          //   "First Name",
          //   "Last Name",
          //   "Mobile Number",
          //   "instagram",
          //   "logo",
          //   "bio",
          // ]);

          // Separate: Profile vs Products
          // For example, first row = profile, rest = products
          // const profileRow = results[0];
          // const productRows = results.slice(1);

          // const profile = {
          //   name: profileRow[mapping.title] || null,
          //   bio:
          //     profileRow[mapping.description] ||
          //     profileRow[mapping.bio] ||
          //     null,
          //   email: profileRow[mapping.email] || null,
          //   address: profileRow[mapping.address] || null,
          //   firstName: profileRow[mapping["First Name"]] || null,
          //   lastName: profileRow[mapping["Last Name"]] || null,
          //   mobile: profileRow[mapping["Mobile Number"]] || null,
          //   instagram: profileRow[mapping.instagram] || null,
          //   logo: profileRow[mapping.logo] || null,
          // };

          // const products = productRows.map((row) => ({
          //   name: row[mapping.title] || null,
          //   description: row[mapping.description] || row[mapping.bio] || null,
          //   sku: row[mapping.sku] || null,
          //   wholesale: row[mapping.wholesale] || null,
          //   retail: row[mapping.retail] || null,
          // }));

          // ✅ Always send structured JSON, not raw text
          // const structuredInput = {
          //   profile,
          //   products,
          // };

          const response = await extractInfoUsing(
            `
              You are an AI data extractor.

              Below is CSV data converted to JSON. The field names may vary — your job is to intelligently map these fields to the correct standardized format for exhibitor onboarding.

              ---
              Here is the extracted CSV data:
              \`\`\`json
              ${JSON.stringify(results, null, 2)}
              \`\`\`
              ---

              ✅ Use your best judgment to map fields like:
              - name → brand_name or title → product title
              - contact names → first_name / last_name
              - phone or mobile → telephone
              - IG handle or instagram → instagram_url
              - logo URL or logo → logo_url
              - description, bio → description
              - minimum qty, quantity → qty
              - product images → imagesURL
              - keywords → keywords
              - title → name → product name → product title,
              - wholesale → price → product price → wholesale price
              - qty → min qty → minimum qty

              ✅ Final structure must look exactly like this:
              \`\`\`json
              {
                "profile": {
                  "brand_name": "",
                  "telephone": "",
                  "first_name": "",
                  "last_name": "",
                  "description": "",
                  "instagram_url": "",
                  "logo_url": "",
                  "email": "",
                  "address": "",
                  "keywords": ""
                },
                "products": [
                  {
                    "title": "",
                    "sku": "",
                    "wholesale": "",
                    "description": "",
                    "qty": "",
                    "imagesURL": []
                  }
                ]
              }
              \`\`\`

              ✅ If any field is missing, use empty string "" or empty array [].

              ✅ Always respond with **only a single JSON block**, wrapped in \`\`\`json.

              Do not include any extra explanation or notes.
              `,
                          `
              You are an expert data extractor.
              You take any messy vendor data and output exactly one clean JSON object
              in the required schema.You should also understand field names if they vary as every CSV might consider different fields as different names.
              for example 
               Never return text outside of the JSON block.
              `
          );

          resolve(response);
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
}

export async function parseXlsx(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const extractedText = xlsx.utils.sheet_to_json(worksheet);
  // You can apply similar header mapping logic as in parseCsv


  const response = await extractInfoUsing(`
Here is the raw extracted text from the file data:
---
${JSON.stringify(extractedText)}
---
Now return only JSON in this format:
{
  "profile": {
    "brand_name": "",
    "telephone": "",
    "first_name: "",
    "last_name": "",
    "description": "",
    "instagram_url": "",
    "logo_url": "",
    "email": "",
    "address": "",
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
`);
  return response;
}

export async function parsePdf(filePath) {
  console.log("Starting PDF parsing for:", filePath);

  return new Promise(async (resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error("PDF parsing error:", errData.parserError);
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", async (pdfData) => {
      console.log("PDF parsed successfully.");
      // Debug: log the structure of the parsed data
      console.log("Parsed PDF data keys:", Object.keys(pdfData));
      // Example: extract text from all pages
      let extractedText = "";
      try {
        pdfData.Pages.forEach((page, pageIndex) => {
          console.log(`Processing page ${pageIndex + 1}`);
          page.Texts.forEach((textObj) => {
            textObj.R.forEach((r) => {
              extractedText += decodeURIComponent(r.T) + " ";
            });
          });
        });
        // console.log('Extracted text preview:', extractedText.substring(0, 500));

        const response = await extractInfoUsing(`
Here is the raw extracted text from the PDF:
---
${extractedText}
---
Now return only JSON in this format:
{
  "profile": {
    "brand_name": "",
    "telephone": "",
    "first_name: "",
    "last_name": "",
    "description": "",
    "instagram_url": "",
    "logo_url": "",
    "email": "",
    "address": "",
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
`);

        resolve(response);
      } catch (err) {
        console.error("Error extracting text:", err);
        reject(err);
      }
    });

    try {
      pdfParser.loadPDF(filePath);
      console.log("PDF loading initiated.");
    } catch (err) {
      console.error("Error loading PDF:", err);
      reject(err);
    }
  });
}
