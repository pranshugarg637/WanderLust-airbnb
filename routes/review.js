const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../models/listing");
const Review=require("../models/review.js");
const {validateReview}=require("../middleware.js");
const {isLoggedin}=require("../middleware.js");
const {isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");
//reviews
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.reviewAdd));
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.reviewDelete));

module.exports=router;