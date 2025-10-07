const mongoose=require("mongoose");
const initData=require("./data");
const Listing=require("../models/listing.js");// .. ka matlab parent directory mein jaake search kro

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(()=>{
    console.log("connected succesfully");
})
.catch((err)=>{
    console.log(err);
});

const initDB=async ()=>{
    await Listing.deleteMany({});
    let newData=initData.data.map((item)=>{
        return{
            ...item,
            // image:item.image.url,
            owner:"68c84958be782c07de2bb56f",
        };
    });
    await Listing.insertMany(newData); 
}
initDB();