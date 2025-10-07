const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description: String,
    image:{
        // type:String,
        // default:"https://images.unsplash.com/photo-1688083400903-e10f8bd9e478?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2NlbmVyeSUyMHdpdGglMjBhJTIwdHJlZSUyMGFuZCUyMG9jZWFufGVufDB8fDB8fHww",
        // set:(v)=>v===""?"https://images.unsplash.com/photo-1688083400903-e10f8bd9e478?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2NlbmVyeSUyMHdpdGglMjBhJTIwdHJlZSUyMGFuZCUyMG9jZWFufGVufDB8fDB8fHww":v,
        url:String,
        filename:String,
    },
    price:Number,
    location: String,
    country: String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async(listingData)=>{
    if(listingData){
        await Review.deleteMany({_id:{$in:listingData.reviews}});
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports= Listing;