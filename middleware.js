const Listing=require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js")
const ExpressError=require("./utils/ExpressError");

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to WanderLust!");
        return res.redirect("/login");
    };
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    // await Listing.findByIdAndUpdate(id,{
    //     title:title,
    //     image:image,
    //     price:price,
    //     location:location,
    //     country:country
    // });
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission as you dont own the listing");
        return res.redirect("/listings");
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");//har element se uska message niklega aur woh sab join ho jayenge(if they are multiple) and that whole collection stored in errMsg
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");//har element se uska message niklega aur woh sab join ho jayenge(if they are multiple) and that whole collection stored in errMsg
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
        let {id,reviewId}=req.params;
    // await Listing.findByIdAndUpdate(id,{
    //     title:title,
    //     image:image,
    //     price:price,
    //     location:location,
    //     country:country
    // });
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission as you dont own the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
