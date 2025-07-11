
  import Mongoose from 'mongoose'
  const MONGO_URI = "mongodb+srv://ribbon:QLM8tIcftKefBF2S@cluster1.wcxct.mongodb.net/ribbon-agency-production-cluster?retryWrites=true&w=majority&retryReads=true";

  console.log("Connecting to DB");
  Mongoose.Promise = global.Promise;
  //Establishing DB connection
   Mongoose.connect(MONGO_URI, {
    useUnifiedTopology: true, //v5
    useNewUrlParser: true, //v5
    useFindAndModify: false,
    poolSize: 100,
    connectTimeoutMS: 60000,
  }).then((dbConnPool) => {
    console.log("mongodb >> connection established successfully: ");
    //loginIntoRibbon();
    return Mongoose;
  });
