const e= require("connect-flash");
const User=require("../models/user");


module.exports.renderSignup=(req,res)=>{
    res.render("./users/signup.ejs");
}

module.exports.actualSignup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome to WanderLust");
            res.redirect("/listings");         
        });
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.actualLogin= async(req,res)=>{
    req.flash("success","Welcome back to WanderLust!");
    let redirectUrl="/listings";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        } 
        req.flash("success","Logged you out!");
        res.redirect("/listings");
    })
}