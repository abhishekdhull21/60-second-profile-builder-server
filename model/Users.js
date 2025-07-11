import mongoose from 'mongoose';

const GSchema = mongoose.Schema;


// Middleware to parse JSON request bodies

let User = new GSchema({
  vendorSalesLocation : {type : Array},
  agencyID: { type: GSchema.Types.ObjectId, ref: "agencies"},
  repID: { type: GSchema.Types.ObjectId, ref: "reps"},
  vendorID: { type: GSchema.Types.ObjectId, ref: "vendors"},
  email: String,
  dedicatedRepID: String,
  username: String,
  description:  String,
  avatarURL: String,
  lastName: String,
  firstName: String,
  brandName: String,
  webSite: String,
  address: String,
  address2: String,
  city: String,
  zipCode: String,
  state: String,
  country: String,
  tel: String,
  interests: [String],
  resellerId: String,
  salesLocations: { type: GSchema.Types.ObjectId, ref: "agencies.salesLocation"},
  buyerLinks: [
    {
      linkName: String,
      linkValue: String
    }
  ], 
  accountID:{type: GSchema.Types.ObjectId, ref: "accounts"},
  currencyCode: String,
  store: {
    profileURL: String,
    about: String,
    openingOrderAmt: { type: Number, default: 0 },
    reorderAmt: { type: Number, default: 0 },
    priceRange : String,
    paymentTerms: String,
    shippingPolicy: String,
    estimatedShipTimes: String,
    returnsAndExchanges: String,   
    vendorNotes: String,
    vendorHighlightMessage: String,
    videoLink : String,
    links: [
      {
        linkName: String,
        linkValue: String
      }
    ], 
    curatedImages : [
      {
        imageSrc : String,
        callToAction : String
      }
    ],
    lookBookURL: [
      {
        imageSrc : String,
        callToAction : String
      }
    ],
    profileSteps: Array,
    heading: String
  },
  territories: [{}],
  last: { type: Date, default: Date.now },
  //type: 0 normal user  1 admin
  type: { type: Number, enum: [0, 1, 2], default: 0 },
  //roleType: 0 Buyer 1 Vendor 2 Agency  3. Account
  roleType: { type: Number, enum: [0, 1, 2, 3], default: 0 },
  //access : -1 freeze , 0 active , 1 wait email active, 2 please reset password
  access: { type: Number, enum: [-1, 0, 1, 2], default: 1 },
  accessType: { type: Number, enum: [0,1,2] }, // 0: Insider 1:Explorer  2:Explorer+
  role:{  type : String},

  //keyType : 0 normal, 1 key user
  keyType: { type: Number, enum: [0, 1], default: 1 },
  //license : 0 rep, 1 remp
  license: { type: Number, enum: [0, 1], default: 1 },

  verifyToken: {
    key: String,
    createTime: { default: Date.now, type: Date }
  },
  shippingAddress: [
    {
      //First one is default shippingAddress
      receiverName: String,
      state: String,
      city: String,
      addr: String,
      addr2: String,
      zipCode: String,
      tel: String
    }
  ],
  emailAuth: {
    key: String,
    createTime: { default: Date.now, type: Date }
  },

  token: {
    //for forgotpassword
    key: String,
    createTime: { default: Date.now, type: Date },
    tokenUsed: {type:Boolean, default: false}
  },

  unsubscribe: {
    invite: { type: Boolean, default: false },
    message: { type: Boolean, default: false }
  },

  loginTime: { type: Date, default: Date.now },
  createTime: { type: Date, default: Date.now },
  
  showroomImageURL : String,
  catalogURL:String,
  payItForwardURL:String,
  exteriorImageURL: String,
  interiorImageURL:String,
  title:String,
  businessWords:[],
  invite : Number,
  inviteHistory: Number,
  //imported: 0, manually created: 1, active: 2: inactive: 3, locked: 4, disabled: 5
  userStatus: { type: Number, enum: [0, 1, 2, 3, 4, 5], default: 0 },
  agencyCommissionPercentage: String,
  repSharePercentage: String,
  houseSharePercentage: String,
  showVendorReport: Number,
  interestedLocations:[],
  focusOfInterest:[],
  referralSource:String,
  attendeeType:String,
  jobLevel:String,
  selectedChannel : String,
  privateBetaFeaturesEnabled: [String],
  paymentTerms: [],
  updateTime: { type: Date, default: Date.now },
  leadTime: { type: Date },
  leadType: { type: Number },
  vendorNotes: String,
  enableCustomFieldForOrder : {type: Boolean, default: false},
  contractType: { type: String, default: "" },
  enablePOCreation : { type: Boolean, default: false},
  showOrderConfirmationAlert: {type: Boolean, default: false},
 // {privilege access to buyers default 1 for normal buyer, 2 for VIP buyers
  userType: { type: Number, enum: [1, 2, 3, 4, 5], default: 1 },
  rsvpFlag: {type: Boolean, default: false}, // rsvp flag for user tradeshow registration
  additionalRequiredFields: { type: Array }, // vendor level check -> fields that are required to confirm orders
  vipBuyerInvalidCode: String, // invalid code tried by user 
  vipBuyerCode : String, // vipbuyer valid code 
  showWelcomePopUp: {type: Boolean, default: true}, // to control the welcome pop when user login first time
  buyerMovedFromAccountID: {type: GSchema.Types.ObjectId, ref: "accounts"}, // to keep record of oldAccount while move buyer
  buyerMovedDate: { type: Date },
  buyerMergedFromAccountID: {type: GSchema.Types.ObjectId, ref: "accounts"}, // to keep record of oldAccount while move buyer
  buyerMergedDate: { type: Date },
  apiKeys : {type : Array},
  userCode: { type: String },
  isDeleted : {type : Boolean},
  lastSSOIn: { type: Date },
  enableRSR1: {type: Boolean, default: false}, // flag to enable send monthly order report for vendor via email
  metaData: { type: Object },
  selfRegistered:{ type: Boolean, default: false },
  statusUpdateHistory: [
    {
        _id: false,
        message: String,
        accessFrom: Number,
        accessTo: Number,
        accessUpdatedDate: { type: Date },
        accessUpdatedBy: { type: GSchema.Types.ObjectId, ref: "users" },
        accessUpdatedByUserType: Number,
        typeFrom: Number,
        typeTo: Number,
        typeUpdatedDate: { type: Date },
        typeUpdatedBy: { type: GSchema.Types.ObjectId, ref: "users" },
        typeUpdatedByUserType: Number
    }
], // to keep track statusUpdateHistory
maskStockInventory : {
    isEnable: Boolean,
    labels: {type: Object } 
    /* 
        The `labels` object helps show product availability based on stock levels. 
        The keys represent stock amounts, and the values are the labels shown. 
        The logic compares stock using "less than":
        Example:
        {
            1: "Out of Stock",
            5: "Low Stock",
            6: "Only 5 left",
            default: "In Stock"
        }

        In this example, if the remaining stock is less than 1, the label "Out of Stock" 
        will be displayed; if it's less than 5, "Low Stock" will be shown; 
        and if it's less than 6, "Only 5 left" will appear. 
        For any other stock level, the label will default to "In Stock".
    */
},
instagram: { type: String } ,
storeType: {type : Array},
interestedShows: { type: Array },
businessValues: { type: Array },
unverified: { type: Boolean, default: false },
// accessType: { type: Number, enum: [0, 1]},
hideEcommerceFeature:{type:Boolean},
enableShopifyApp: { type: Boolean },
enableMarketingEmail: { type: Boolean },
magicLinkToken: String,
printerConfig: Object,
activity: {type: Object}
});



// Function to add a user (as you provided)
User.plugin(function (schema) {
    schema.statics.addUser = async function (userData) {
      try {
        // Create a new user instance
        const newUser = new this({
          vendorSalesLocation: userData.vendorSalesLocation || [],
          agencyID: mongoose.Types.ObjectId("5f077a2f7d6be71f487bdd33"), // Example static agency ID
          vendorID: userData.vendorID,
          email: userData.email,
          username: userData.username || "",
          description: userData.description || "",
          avatarURL: userData.avatarURL || "",
          lastName: userData.lastName || "",
          firstName: userData.firstName || "",
          brandName: userData.brandName || "",
          webSite: userData.webSite || "",
          address: userData.address || "",
          address2: userData.address2 || "",
          city: userData.city || "",
          zipCode: userData.zipCode || "",
          state: userData.state || "",
          country: userData.country || "",
          tel: userData.telephone || "",
          interests: userData.interests || [],
          buyerLinks: userData.buyerLinks || [],
          accountID: userData.accountID,
          currencyCode: userData.currencyCode || "$",
          store: userData.store || {},
          territories: userData.territories || [],
          type: userData.type || 0, // Default: Normal user
          roleType: 1, // Vendor's role type is 1
          access: 0, // Default: Active
          role: userData.role,
          keyType: userData.keyType || 1,
          license: userData.license || 1,
          shippingAddress: userData.shippingAddress || [],
          emailAuth: userData.emailAuth || {},
          token: userData.token || {},
          unsubscribe: userData.unsubscribe || {},
          loginTime: new Date(),
          createTime: new Date(),
          userStatus: userData.userStatus || 0,
          agencyCommissionPercentage: userData.agencyCommissionPercentage || '',
          repSharePercentage: userData.repSharePercentage || '',
          houseSharePercentage: userData.houseSharePercentage || '',
          showVendorReport: userData.showVendorReport || 0,
          interestedLocations: userData.interestedLocations || [],
          focusOfInterest: userData.focusOfInterest || [],
          referralSource: userData.referralSource,
          attendeeType: userData.attendeeType,
          jobLevel: userData.jobLevel,
          selectedChannel: userData.selectedChannel,
          privateBetaFeaturesEnabled: userData.privateBetaFeaturesEnabled || [],
          paymentTerms: userData.paymentTerms || [],
          updateTime: new Date(),
          leadTime: userData.leadTime || null,
          leadType: userData.leadType || null,
          vendorNotes: userData.vendorNotes || '',
          enableCustomFieldForOrder: userData.enableCustomFieldForOrder || false,
          contractType: userData.contractType || '',
          enablePOCreation: userData.enablePOCreation || false,
          showOrderConfirmationAlert: userData.showOrderConfirmationAlert || false,
          userType: userData.userType || 1, // Default: Normal user
          rsvpFlag: userData.rsvpFlag || false,
          additionalRequiredFields: userData.additionalRequiredFields || [],
          vipBuyerInvalidCode: userData.vipBuyerInvalidCode,
          vipBuyerCode: userData.vipBuyerCode,
          showWelcomePopUp: userData.showWelcomePopUp || true,
          buyerMovedFromAccountID: userData.buyerMovedFromAccountID,
          buyerMovedDate: userData.buyerMovedDate,
          buyerMergedFromAccountID: userData.buyerMergedFromAccountID,
          buyerMergedDate: userData.buyerMergedDate,
          apiKeys: userData.apiKeys || [],
          userCode: userData.userCode,
          isDeleted: userData.isDeleted || false,
          lastSSOIn: userData.lastSSOIn || null,
          enableRSR1: userData.enableRSR1 || false,
          metaData: userData.metaData || {},
          selfRegistered: userData.selfRegistered || false,
          statusUpdateHistory: userData.statusUpdateHistory || [],
          maskStockInventory: userData.maskStockInventory || {},
          instagram: userData.instagram || '',
          storeType: userData.storeType || [],
          interestedShows: userData.interestedShows || [],
          businessValues: userData.businessValues || [],
          unverified: userData.unverified || false,
          hideEcommerceFeature: userData.hideEcommerceFeature || false,
          enableShopifyApp: userData.enableShopifyApp || false,
          enableMarketingEmail: userData.enableMarketingEmail || false,
          magicLinkToken: userData.magicLinkToken || '',
          printerConfig: userData.printerConfig || {},
          activity: userData.activity || {}
        });
    
        // Save the user to the database
        await newUser.save();
    
        return { success: true, message: 'User added successfully!', user: newUser };
      } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
      }
    }
})



export default mongoose.model("users", User);