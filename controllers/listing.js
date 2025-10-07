const Listing=require("../models/listing");

//index route
module.exports.index=async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

//create route
module.exports.renderNewForm=(req,res)=>{
    res.render("./listings/new.ejs");
};
module.exports.createNew=async (req,res,next)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data pls");
    // }
    let url=req.file.path;
    let fileName=req.file.filename;
    // console.log(url," ......",fileName);
    const newListing=new Listing(req.body.listing);//for reference check above
    newListing.owner=req.user._id;
    newListing.image={url,fileName};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    // let {title,description,image,price,location,country}=req.body.listing;
    // Listing.insertOne({
    //     title:title,
    //     description:description,
    //     image:image,
    //     price:price,
    //     location:location,
    //     country:country
    // });
    
};

//show route
module.exports.show=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    }}).populate("owner");
    if(!listing){
        req.flash("error","The listing you are trying to fetch does not exist ");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}

//edit route
module.exports.edit=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you are trying to find does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    console.log(originalImageUrl);
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");//note this would not work on the files that are already initialised and would already work on files added later. matlab jo unsplash wali thi unpe nhi kaam krega kyunki usme toh upload hain hi nahi. usme toh humne link ke through add ki thi images
    res.render("./listings/edit.ejs",{listing,originalImageUrl});
}
//update route
module.exports.update=async (req,res)=>{
    let {id}=req.params;
    // await Listing.findByIdAndUpdate(id,{
    //     title:title,
    //     image:image,
    //     price:price,
    //     location:location,
    //     country:country
    // });
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});//... ne spread krke plain object bana diya
    if(typeof req.file!="undefined"){//agar koi file nhi aati yaani ki edit krne ke liye image nhi daali toh wahi image jaaye and koi error na aaye isliye
        let url=req.file.path;
        let fileName=req.file.filename;
        listing.image={url,fileName};
        await listing.save();
    }
    req.flash("success","Listing Edited!");
    res.redirect("/listings");
}

//delete
module.exports.destroy=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}