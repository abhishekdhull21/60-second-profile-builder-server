import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import {  scrapeGenericUrl } from './services/scraper.service.js';
import { parseCsv, parseXlsx, parsePdf } from './services/parser.service.js';
import  Mongoose  from 'mongoose';
import axios from 'axios';
import "./config/db.js"
import Product from './model/Product.js';
import User from './model/Users.js'; // Make sure the path is correct
import Vendor from './model/Vendor.js'; // Add this import at the top if not present


const app = express();
const PORT = process.env.PORT || 3001;
const upload = multer({ dest: 'uploads/' });

app.use(cors({
  origin: true, // Reflect the request origin, allowing any frontend with credentials
  optionsSuccessStatus: 200,
  credentials: true,
  preflightContinue: false
}));
app.use(express.json());

async function getAllShopifyProducts(storeUrl, brandName) {

  const allProducts = [];
  let page = 1;
  const limit = 50;

  while (true) {
    const url = `${storeUrl}/products.json?limit=${limit}&page=${page}`;

    try {
      const response = await axios.get(url);
      const products = response.data.products;

      for (const product of products) {
        // let vendorID = new Mongoose.Types.ObjectId("6870b1d77f698e0014314761")
        let agencyID = new Mongoose.Types.ObjectId("5f077a2f7d6be71f487bdd33")
        const mappedProduct = await shopifyToRibbonProductMapping(
          agencyID, // example agencyID
          "", // example vendorID
          brandName, // example brandName
          product,
          true // allowZeroProductPrice
        );

        allProducts.push(mappedProduct);
      }

      if (!products || products.length === 0 || products.length < 50) {
        console.log("No more products found.");
        break;
      }

      page++;
      if (page > maxPages) {
        console.warn("Max page limit reached. Stopping pagination.");
        break;
      }
    } catch (error) {
      console.error(`Failed on page ${page}:`, error.response?.status || error.message);
      break;
    }
  }

  return allProducts;
}


const getValue = (arr, key) => {
  return arr?.find(item => item?.name?.toLowerCase() === key)?.value || null;
};

const shopifyToRibbonProductMapping = async (agencyID, vendorID, brandName, currentProduct, allowZeroProductPrice) => {
  const contextualPrice = currentProduct?.variants?.[0]?.contextualPricing?.price;
  const shopifyProductPrice = contextualPrice || currentProduct?.variants[0]?.price;
  let productWholeSale = shopifyProductPrice;

  return {
    isShopifySyncedProduct: true,
    agencyID: agencyID,
    vendorId: vendorID,
    name: currentProduct?.title,
    description: currentProduct?.description,
    qty: 1,
    brandName: brandName,
    imagesURL: currentProduct?.images?.map((img) => img?.src),
    wholesale:
      (productWholeSale == 0 || productWholeSale == "0.00" || productWholeSale == "00.00") &&
      allowZeroProductPrice
        ? null
        : productWholeSale,
    sku: currentProduct?.variants[0]?.sku,
    type: 0,
    tags: currentProduct?.tags?.join(),
    variantInfo: {
      options:
        currentProduct?.options?.length >= 1 &&
        currentProduct?.options[0]?.name !== "Title" &&
        currentProduct?.options[0]?.values[0] !== "Default Title"
          ? currentProduct?.options.map((item) => ({
              key: item?.name,
              value: item?.values.join(),
            }))
          : [],
      variants:
        currentProduct?.variants?.length >= 1 &&
        currentProduct?.options[0]?.name !== "Title" &&
        currentProduct?.options[0]?.values[0] !== "Default Title"
          ? currentProduct?.variants?.map((item) => {
              let temp = [];
              item?.selectedOptions?.forEach((val) => temp.push(val.value));
              let variantContextualPrice = item?.contextualPricing?.price?.amount || item?.price?.amount;
              let variantWholeSale = parseFloat(variantContextualPrice).toFixed(2);
              return {
                sku: item?.sku,
                variantImage: item?.image?.src,
                wholesale:
                  (variantWholeSale == 0 || variantWholeSale == "0.00" || variantWholeSale == "00.00") &&
                  allowZeroProductPrice
                    ? null
                    : variantWholeSale,
                upc: item?.barcode,
                qty: 1,
                options: temp,
                color: getValue(item?.selectedOptions, "color"),
                size: getValue(item?.selectedOptions, "size"),
                materials: getValue(item?.selectedOptions, "material"),
                type: 1,
              };
            })
          : [],
    },
  };
};


const mapProduct = (product, agencyID, vendorId) => {
  console.log(product, agencyID, vendorId,"this is product, agencyID, vendorId 143")
  return {
    ...product,
    name: product.title || product.name,
    wholesale: product.retail || product.wholesale,
    agencyID: agencyID,
    vendorId: vendorId,
    type: 0
  };
}

// Route to trigger the fetch
app.get("/api/fetch-products", async (req, res) => {
  const storeUrl = req.query.url;
  try {
    const products = await getAllShopifyProducts(storeUrl);

    await Product.bulkAddProducts(products)
    res.status(200).json({
      message: "Products fetched successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Main processing endpoint with automatic type detection
app.post('/api/process', upload.single('file'), async (req, res) => {
    // We will determine the type based on the request content
    const { source , isFetchProduct} = req.body;
    const file = req.file;


    try {
        let result;

        // Case 1: A URL was provided in the 'source' field
        if (source) {
            // Simple check to see if it's a Shopify URL
         
      
                console.log('Detected Generic URL...');
                result = await scrapeGenericUrl(source)
            }
        
        // Case 2: A file was uploaded
        else if (file) {
            console.log(`Detected file upload: ${file.originalname} (${file.mimetype})`);
            // Use the file's MIME type to determine what it is
            switch (file.mimetype) {
                case 'text/csv':
                    result = await parseCsv(file.path);
                    break;
                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': // .xlsx
                case 'application/vnd.ms-excel': // .xls
                    result = await parseXlsx(file.path);
                    break;
                case 'application/pdf':
                    result = await parsePdf(file.path);
                    break;
                default:
                    throw new Error(`Unsupported file type: ${file.mimetype}`);
            }
        } 
        // Case 3: No valid input was provided
        else {
            throw new Error('No input provided. Please provide a "source" URL or upload a file.');
        }
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Processing Error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        // Clean up the uploaded file
        if (file) {
            fs.unlinkSync(file.path);
        }
    }
});

// API to create a vendor user
app.post('/api/vendors', async (req, res) => {
  try {
    let {data , products = [],source} = req.body;

    
    // Remap incoming fields to match your User/Vendor schema
    const userData = {
      brandName: data.brand_name || data.brandName,
      email: data.email,
      address: data.address || "",
      tel: data.telephone || data.tel || "",
      firstName: data.first_name || data.firstName || "",
      lastName: data.last_name || data.lastName || "",
      description: data.description || "",
      avatarURL: data.logo_url || data.logoUrl || "",
      instagram: data.instagram_url || data.instagram || "",
      facebook: data.facebook_url || data.facebook || "",
      twitter: data.twitter_url || data.twitter || "",
      linkedin: data.linkedin_url || data.linkedin || "",
      webSite: data.website || data.webSite || "",
      products: data.products || [],
      roleType: 1, // Vendor
      type: 0,     // Normal user
      access: 0    // Active
    };

    // Create vendor in Vendor collection first
    const vendorResult = await Vendor.addVendor(userData);

    if (!vendorResult.success) {
      return res.status(400).json({
        success: false,
        message: vendorResult.message
      });
    }

    // Attach vendorId to userData for User collection
    userData.vendorID = vendorResult.vendor._id;

    // Create user in User collection
    const result = await User.addUser(userData);
    if(source?.includes?.("myshopify.com")){
       products = await getAllShopifyProducts(source);
    }
    let allProducts = []
    for (const product of products) {
        // let vendorID = new Mongoose.Types.ObjectId("6870b1d77f698e0014314761")
        let agencyID = new Mongoose.Types.ObjectId("5f077a2f7d6be71f487bdd33")
        const mappedProduct = await mapProduct(
          product,
          agencyID, // example agencyID
          result.user._id, // example vendorID
        );

        allProducts.push(mappedProduct);
      }

   let response =  await Product.bulkAddProducts(allProducts)  

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Vendor created successfully.',
        user: result.user,
        vendor: vendorResult.vendor,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Vendor Creation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message
    });
  }
});

// CORS error handler middleware
app.use((err, req, res, next) => {
  if (err && err.name === 'CorsError') {
    console.error('CORS Error:', err.message);
    return res.status(401).json({ error: 'CORS Error', message: err.message });
  }
  next(err);
});

// General error handler (optional, for other errors)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});