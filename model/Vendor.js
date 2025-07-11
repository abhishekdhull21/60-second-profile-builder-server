import mongoose from 'mongoose';
const GSchema = mongoose.Schema;

let Vendors = new GSchema({
  agencyID: { type: GSchema.Types.ObjectId, ref: "agencies"},
  vendorID: { type: GSchema.Types.ObjectId },
  brandName: { type: String, default: "" },
  firstName: String,
  lastName: String,
  email: String,
  webSite: String,
  address: String,
  address2: String,
  city: String,
  zipCode: String,
  state: String,
  country: String,
  tel: String,
  username: String,
  dedicatedRepID:  { type: GSchema.Types.ObjectId },
  loadTime:Date,
  loadId:Number,
  catalogURL:String,
  payItForwardURL:String,
  agencyCommissionPercentage : String,
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now },
  paymentTerms: [],
  gateway: {
    enabled: Boolean,
    provider: String,
    gatewayType: String,
    gatewayName: String,
    gatewayToken: String,
    gatewayPayload: Object
  },
  international: Boolean,
  receiver: {
    enabled: Boolean,
    provider: String,
    receiverType: String,
    receiverName: String,
    receiverToken: String,
    receiverApi: String,
    receiverPayload: Object
  },
  skipGatewayVerify: Boolean,
  skipBillingAddressVerification: {type: Boolean, default: false},
  omitOrderBillingAddress: Boolean
});


Vendors.plugin(function (schema) {
  schema.statics.addVendor = async function (vendorData) {
    try {
    // Create a new vendor instance
    const newVendor = new this({
      agencyID: mongoose.Types.ObjectId("5f077a2f7d6be71f487bdd33"),  // Setting the agencyID directly to the given ObjectI
      brandName: (vendorData.brandName || "").trim(),
      firstName: (vendorData.firstName || "").trim(),
      lastName: (vendorData.lastName || "").trim(),
      email: (vendorData.email || "").trim(),
      webSite: (vendorData.webSite || "").trim(),
      address: (vendorData.address || "").trim(),
      address2: (vendorData.address2 || "").trim(),
      city: (vendorData.city || "").trim(),
      zipCode: (vendorData.zipCode || "").trim(),
      state: (vendorData.state || "").trim(),
      country: (vendorData.country || "").trim(),
      tel: (vendorData.tel || "").trim(),
      username: (vendorData.username || "").trim(),
      dedicatedRepID: vendorData.dedicatedRepID,
      loadTime: vendorData.loadTime || new Date(),
      loadId: vendorData.loadId || null,
      catalogURL: (vendorData.catalogURL || "").trim(),
      payItForwardURL: (vendorData.payItForwardURL || "").trim(),
      agencyCommissionPercentage: (vendorData.agencyCommissionPercentage || "").trim(),
      createTime: new Date(),
      updateTime: new Date(),
      paymentTerms: vendorData.paymentTerms || [],
      gateway: vendorData.gateway || {
        enabled: false,
        provider: "",
        gatewayType: "",
        gatewayName: "",
        gatewayToken: "",
        gatewayPayload: {}
      },
      international: vendorData.international || false,
      receiver: vendorData.receiver || {
        enabled: false,
        provider: "",
        receiverType: "",
        receiverName: "",
        receiverToken: "",
        receiverApi: "",
        receiverPayload: {}
      },
      skipGatewayVerify: vendorData.skipGatewayVerify || false,
      skipBillingAddressVerification: vendorData.skipBillingAddressVerification || false,
      omitOrderBillingAddress: vendorData.omitOrderBillingAddress || false
    });

    // Save the vendor to the database
    await newVendor.save();

    return { success: true, message: 'Vendor added successfully!', vendor: newVendor };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
  }
});

export default mongoose.model("vendors", Vendors);