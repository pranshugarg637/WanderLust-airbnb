const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const {isLoggedin}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const {validateListing}=require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

const listingController=require("../controllers/listing.js");
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createNew));

//create route
router.get("/new",isLoggedin,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedin,isOwner,validateListing,upload.single('listing[image]'),wrapAsync(listingController.update))
.delete(isLoggedin,isOwner,wrapAsync(listingController.destroy));

//edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.edit))

module.exports=router;