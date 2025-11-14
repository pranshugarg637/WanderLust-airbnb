if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const dbURL=process.env.ATLASDB_URL;
const express=require("express");
const app=express();
const port=process.env.PORT || 3000;
const mongoose=require("mongoose");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
const ejsMate=require("ejs-mate");
app.engine('ejs',ejsMate);  // used in layouts folder
const ExpressError=require("./utils/ExpressError");
const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
app.use(flash());
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const store=MongoStore.create({ 
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:86400,
});
store.on("error",()=>{
    console.log("ERROR in SESSION STORE :",err);
})
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

app.use(session(sessionOptions));

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    res.locals.redirectUrl=req.originalUrl;
    // res.locals.username=req.user.username;
    next();
});
// app.get("/registerUser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"college-student",//note ki humne user.js wali file mein sirf email add kiya hain schema mein but fir bhi hum isme username add kr sakte hain because of passport-local-mongoose
//     });
//     let newUser=await User.register(fakeUser,"helloWorld");
//     res.send(newUser);
// })



const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

async function main(){
    // await mongoose.connect("mongodb://value from npm/wanderlust");
    await mongoose.connect(dbURL);
}
main().then(()=>{
    console.log("connected succesfully");
})
.catch((err)=>{
    console.log(err);
});
// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"my home",
//         description:"by the beach",
//         price:1200,
//         location:"south goa",
//         country:"India"
//     });
//     await sampleListing.save();
//     res.send("success");
// })

app.get("/", (req, res) => {
  res.redirect("/listings");
});
app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});


//error handling middleware
app.use((err,req,res,next)=>{// throw kare hue error ko yaha catch karenge and then perform operations mentioned in the block
    let {status=500,message="something went wrong"}=err;
    res.status(status).render("listings/error.ejs",{message});
})
app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
});
 