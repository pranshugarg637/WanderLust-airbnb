const Review=require("../models/review");
const Listing=require("../models/listing");

module.exports.reviewAdd=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(req.user);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Added!");
    res.redirect(`/listings/${id}`);
}

module.exports.reviewDelete=async (req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);//but iss tareeka se sirf review model se delete hoga naaki listing ke andar jo reviews array hain uska data bhi delete hoga. To accomplish that we use pull
    req.flash("success","Review Deleted!"); 
    res.redirect(`/listings/${id}`);
}