import  Mongoose  from 'mongoose';
import _ from 'lodash';


const GSchema = Mongoose.Schema;

const GShowFields = {
   _id: 1,
  agencyID: 1,
  //create by user refer
  user: 1, 
  brandName: 1, 
  username: 1,   
  topOne:1, 
  type: 1, 
  name: 1, 
  description: 1, 
  imagesURL: 1, 
  price: 1, 
  wholesale: 1, 
  sku: 1,
  availability: 1,
  category:1, 
  stock: 1, 
  qty: 1, 
  maxQty: 1, 
  productETA: 1, 
  parent: 1, 
  published: 1, 
  taxStatus: 1, 
  productType: 1, 
  discountedProduct: 1, 
  outOfStock:  1, 
  shippingClass: 1, 
  allowCustomerReview:  1, 
  height:  1, 
  inStock:  1, 
  isFeatured:  1, 
  lowStockAmount:  1, 
  giftCard:  1, 
  maxPrice:  1, 
  productColor:  1, 
  productSwatches:  1, 
  productTitleImage:  1, 
  etaCancelDate:  1, 
  backInStock:  1, 
  productMSRP:  1, 
  productNewSeasonCollection:  1, 
  productSimpleSize:  1, 
  simpleOutOfStock:  1, 
  iconNewItem:  1, 
  variationMSRP:  1, 
  stockCT:  1, 
  stockNV:  1, 
  variationOutOfStock: 1, 
  syncStatus:  1, 
  desiredPostSlug:  1, 
  wpOldDate:  1, 
  slideTemplate: 1, 
  position: 1, 
  purchaseNote: 1, 
  salePrice: 1,
  shortDescription: 1,
  tags: 1,
  taxClass: 1,
  upsells: 1,
  catalogVisibility: 1,
  ounceWeight:1,
  inWidth: 1,
  vendorId: 1,
  status: 1,
  class: 1,
  loadId: 1,
  variantInfo: 1,
  createTime: 1,
  updateTime: 1,
  originalImagesURL: 1,
  sortOrder: 1,
  upc:1,
  color: 1,
  room: 1,
  origin: 1,
  values: 1,
  materials: 1,
  productChangeHistoryLog:1,
  collectionFacet:1,
  currencyCode: 1,
  categoryFacet : 1,
  priceFacet :1,
  size :1,
  gallery :1,
  artist :1 ,
  galleryCity : 1,
  galleryCountry : 1,
  yearFacet :1,
  paymentFacet: 1,
  isInquired:1,
  yearFacetValue:1
};

let ProductSchema = new GSchema({
  agencyID: { type: GSchema.Types.ObjectId},
  //create by user refer
  user: { type: GSchema.Types.ObjectId}, 

  originalVendorID: { type: GSchema.Types.ObjectId}, 
  
  originalAgencyID: { type: GSchema.Types.ObjectId}, 
  
  brandName: { type: String, default: '' },

  username: { type: String, default: '' },

  //One vendor only has one product as topOne
  topOne: { type: Number, default: 0 },

  type: { type: Number, default: 0 }, //0 publish // 1 draft // 2 deleted // 3 hidden // 4 discontinued
  name: String,
  description: String,
  imagesURL: Array,
  price: { type: Number, default: 0 }, // MSRP
  wholesale: { type: Number },
  
  sku: String, //product Id SKU-1000 
  availability: String, 
  category: Array,

  stock: { type: Number, default: 0 }, //  total product number
  isInquired :{type : Array },
  qty: { type: Number, default: 0 }, //min order
  maxQty: { type: Number, default: 0 }, // > 1 open limit order
  productETA: { type: String, default: '' },
  parent: { type: String, default: '' },
  //Do not use the field, please use type replace published
  published: { type: Number, default: 0 }, 
  taxStatus: { type: String, default: '' },
  currencyCode: {type: String},
  productType: { type: Array },
  discountedProduct: { type: String, default: '' },
  outOfStock:  { type: Number, default: 0 },
  shippingClass: String || "",
    allowCustomerReview: { type: Number, default: 0 },
    height: { type: String, default: '' },
    inStock: { type: String, default: '' },
    isFeatured: { type: String, default: '' },
    lowStockAmount: { type: String, default: '' },
    giftCard: { type: String, default: '' },
    maxPrice: { type: String, default: '' },
    productColor: { type: String, default: '' },
    productSwatches: { type: String, default: '' },
    productTitleImage: { type: String, default: '' },
    etaCancelDate: { type: String, default: '' },
    backInStock: { type: String, default: '' },
    productMSRP: { type: String, default: '' },
    productNewSeasonCollection: { type: String, default: '' },
    productSimpleSize: { type: String, default: '' },
    simpleOutOfStock: { type: String, default: '' },
    iconNewItem: { type: String, default: '' },
    variationMSRP: { type: String, default: '' },
    stockCT: { type: String, default: '' },
    stockNV: { type: String, default: '' },
    variationOutOfStock: { type: String, default: '' },
    syncStatus: { type: String, default: '' },
    desiredPostSlug: { type: String, default: '' },
    wpOldDate: { type: String, default: '' },
    slideTemplate: { type: String, default: '' },
    position: { type: String, default: '' },
    purchaseNote: { type: String, default: '' },
    salePrice: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    tags: { type: String, default: '' },
    taxClass: { type: String, default: '' },
    upsells: { type: String, default: '' },
    catalogVisibility: { type: String, default: '' },
    ounceWeight: { type: String, default: '' },
    inWidth: { type: String, default: '' },
    vendorId: {type: GSchema.Types.ObjectId},
    status: {type: String, default: ''},
    class: {type: String, default: ''},
    loadId: { type: Number, default: 0 },
    upc: { type: String },
    sortOrder: {type: Number, default:null},

  variantInfo: {
    options: [
      {
        key: String,
        value: String
      }
    ], //only support three items , eg Color,Size,material
    variants: [
      {
        sku: String,
        variantImage: String,
        facets:[],
        options: [],
        availability: String,
        qty: { type: Number, default: 0 },
        maxQty: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        wholesale: { type: Number },
        stock: { type: Number, default: 0 },
        inActive: { type: Number, default: 0 },
        color: Array,
        room: Array,
        origin: Array,
        values: Array,
        materials: Array,
        collectionFacet: Array,
        type: { type: Number, default : 0 },
        upc: { type: String },
        // b2cExperience facets
        categoryFacet : Array,
        priceFacet :  Array,
        size : Array,
        gallery : Array,
        artist : Array,
        galleryCity : Array,
        galleryCountry : Array,
        yearFacet : Array,
        paymentFacet: Array,
        shopifyProductInfo:{
            variant_id: String,
          }
      }
    ]
  },
  productChangeHistoryLog: Array,
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now },
  updatedByUserType: {type: Number, default:1},
  originalImagesURL: Array,
  vendorStatus : Number, 
  color: Array,
  room: Array,
  origin: Array,
  values: Array,
  materials: Array,
  collectionFacet: Array,
  updatedByUser: { type: GSchema.Types.ObjectId},
  //default product level facets for B2CExperience
  categoryFacet : Array,
  priceFacet :  Array,
  size : Array,
  gallery : Array,
  artist : Array,
  galleryCity : Array,
  galleryCountry : Array,
  yearFacet : Array,
  paymentFacet: Array,
  yearFacetValue: String,
  errorAlerts : Array,
  isShopifySyncedProduct : {type:Boolean},
  shopifyProductInfo:{
    product_id: String,
    variant_id: String,
  },
  // facets end here
});
ProductSchema.plugin(function (schema) {
    const handleVariantOptions = async (product) => {
    console.log("control is inside handleVariantOPtions");
    if (
      product &&
      product.variantInfo &&
      (product.variantInfo.options &&
        product.variantInfo.options.length > 0)
    ) {
      if (product.variantInfo.variants && product.variantInfo.variants.length === 0) {
        product.variantInfo.options = [];
      } else if (product.variantInfo.options.length > 0) {
        let variantOptions = [];
        product.variantInfo.variants && product.variantInfo.variants.length > 0
          product.variantInfo.variants.map((variant) => {
            if (
              variant.options &&
              variant.options.length > 0 &&
              (variant.inActive === 0 || variant.inActive == null || variant.inActive == undefined)
            ) {
               variantOptions.push(...variant.options);
            }
          });
        variantOptions = [...new Set(variantOptions)];
        if (variantOptions && variantOptions.length > 0) {
          product.variantInfo.options = product.variantInfo.options.filter(
            (option) => {
              const filteredOPtions =
                (option.value &&
                  option.value.length > 0 &&
                  String(option.value)
                    .split(",")
                    .filter((value) => variantOptions.indexOf(value) !== -1)) ||
                [];
              if (filteredOPtions && filteredOPtions.length > 0) {
                option.value = _.map(filteredOPtions, item => item).join(",");
                return option;
              }
            }
          );
        } else product.variantInfo.options = [];
      }
    }
    return product;
  };
    schema.statics.bulkAddProducts = async function (products = [], options = {}) {
    const self = this;

    const validProducts = [];
    const failedProducts = [];

    for (let product of products) {
        try {
        const allVariantsSKU = product.variantInfo?.variants?.map(v => v.sku) || [];
        const duplicateVariantSKU = allVariantsSKU.filter((e, i, a) => a.indexOf(e) !== i);
        const allowZeroProductPriceFlag = true;

        // Clean up zero wholesale prices if allowed
        if (product.wholesale === 0 && allowZeroProductPriceFlag) {
            product.wholesale = null;
        }

        product.variantInfo?.variants?.forEach((variant) => {
            if (variant.wholesale === 0 && allowZeroProductPriceFlag) {
            variant.wholesale = null;
            }
        });

        allVariantsSKU.push(product.sku);
        // product = await handleVariantOptions(product);

        if (duplicateVariantSKU.length > 0) {
            throw new Error('SKU can not be duplicate');
        }

        const productTitle = product.name?.toLowerCase();
        const existing = await self.find({
            $or: [
            { "variantInfo.variants.sku": { $in: allVariantsSKU } },
            { sku: { $in: allVariantsSKU } },
            { name: { "$regex": `^${product?.name?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "$options": "i" } }
            ],
            vendorId: product.vendorId
        });

        if (existing.length > 0) {
            const hasDuplicateTitle = existing.some(e => e.name?.toLowerCase() === productTitle);
            throw new Error(hasDuplicateTitle ? 'Product title already exists' : 'Product SKU already exists');
        }

        // Build product change history
        product.productChangeHistoryLog = [{
            productTypeFrom: parseInt(product.type),
            productTypeTo: parseInt(product.type),
            productUpdateDate: new Date(),
            productUpdateByUser: Mongoose.Types.ObjectId(product.updatedByUser),
            productUpdateByUserType: product.updatedByUserType
        }];
        product.createTime = new Date();

        validProducts.push(product);
        } catch (err) {
        failedProducts.push({
            ...product,
            reason: err.message || 'Unknown error',
            createdAt: new Date()
        });
        }
    }

    // Insert valid products in bulk
    let inserted = [];
    if (validProducts.length > 0) {
        inserted = await self.insertMany(validProducts, { ordered: false });
    }

    // Insert staged products
    // if (failedProducts.length > 0) {
    //     await StagedProduct.insertMany(failedProducts.map(p => ({
    //     ...p,
    //     createdAt: new Date()
    //     })), { ordered: false });
    // }

    return {
        success: inserted,
        failed: failedProducts
    };
    };
});

const Product = Mongoose.model("products", ProductSchema);
export default Product;