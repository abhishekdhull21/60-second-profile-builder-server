import { chromium } from "playwright-chromium";
import { extractInfoUsing, structureText } from "./ai.service.js";

export async function scrapeShopify(url) {
  console.log(`Scraping Shopify store: ${url}`);
  const baseUrl = new URL(url);
  const productsUrl = `${baseUrl.origin}/products.json?limit=250`;
  try {

    const response = await fetch(productsUrl);
    if (!response.ok) throw new Error("Failed to fetch Shopify products.json");

    const { products } = await response.json();
  } catch (err) {
    console.log(err);
  }

  // const profile = { name: new URL(url).hostname.replace('.myshopify.com', '').replace('.com', ''), description: 'Shopify Store' };
  // return { profile, products };
}

export async function scrapeGenericUrl(url) {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: "Missing URL" });

  let browser;
  try {
    // 🕸️ Launch browser and scrape social links + logo
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });

    // Scrape social links
    const socialLinks = await page.$$eval("a[href]", (links) => {
      const socials = {
        instagram: "",
        facebook: "",
        twitter: "",
        linkedin: "",
      };
      links.forEach((link) => {
        const href = link.href.trim().toLowerCase();
        if (href.includes("instagram.com") && !socials.instagram)
          socials.instagram = href;
        if (href.includes("facebook.com") && !socials.facebook)
          socials.facebook = href;
        if (href.includes("twitter.com") && !socials.twitter)
          socials.twitter = href;
        if (href.includes("linkedin.com") && !socials.linkedin)
          socials.linkedin = href;
      });
      return socials;
    });

    // Scrape logo URL
    let logoUrl = await page
      .$eval("link[rel*='icon']", (el) => el.href)
      .catch(() => "");
    if (!logoUrl) {
      logoUrl = await page
        .$eval("meta[property='og:image']", (el) => el.content)
        .catch(() => "");
    }

    await browser.close();

    const response = await extractInfoUsing(
      `Extract vendor details from this website: ${url}`,
      `You are an AI that extracts clean and structured vendor profile data from a website URL.
Here are pre-scraped values you must use as-is:
- instagram_url: ${socialLinks.instagram}
- facebook_url: ${socialLinks.facebook}
- twitter_url: ${socialLinks.twitter}
- linkedin_url: ${socialLinks.linkedin}
- logo_url: ${logoUrl}

Return only a strict JSON object with these fields:
- brand_name
- email (fetch always from support)
- address (fetch address/office details from contact page)
- telephone (fetch mobile/telephone always from contact/support)
- first_name
- last_name
- description (2-3 sentences about the brand)
- instagram_url
- facebook_url
- twitter_url
- linkedin_url
- logo_url

Important:
- Use the pre-scraped social URLs and logo exactly as provided. Do NOT guess or generate them.
- Respond ONLY with the JSON object. No markdown, notes, or extra text.
- Leave any field blank if accurate data is unavailable.`
    );

   return response;
  } catch (err) {
    if (browser) await browser.close();
    console.error("Extraction Error:", err.message);
    throw({ error: "Failed to extract vendor details." });
  }
}
