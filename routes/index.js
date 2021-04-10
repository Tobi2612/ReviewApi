const router = require("express").Router();
const User = require('../models/User')
const {registerValidation ,reviewValidation,loginValidation} = require("../middleware/validation")
const auth = require("../middleware/verify_token")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Blacklist = require("../models/Blacklist");
const Review = require('../models/Review')
const { nextTick } = require("process");

const multer  = require('multer');

router.post('/register', async (req,res) =>{
    console.log('here')
    console.log(req.body)
    //check if there is an error on the registration form
    const {error} = registerValidation(req.body);
    if(error){
        //return the error if error
        return res.status(400).json({error:error.details[0].message})
    }
    //check if user already  exists
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist){
        return res.status(400).json({error:'Email already exists'});
    }
    //check if the password and confirm password match
    if(req.body.password != req.body.confirm_password){
        return res.status(400).json({error:"passwords don't match"})
    }
//crypting password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);
//creating a new user 

    const user = new User ({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email : req.body.email,
        password : hashPassword
    })
    try {
        //saving user if no errors
       const saveduser = await user.save();
       const tempuser = {
           createdAt: saveduser.createdAt,
           _id: saveduser._id,
           firstname: saveduser.firstname,
           lastname: saveduser.lastname,
           email : saveduser.email
       }
       //asign a jwt token for authentication
       const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET,{expiresIn: '3h'})
       res.header('Authorization', token);
       //print user in json format
       res.json({user:tempuser, token:token});
    }catch(err){
        res.status(400).json(err);
    }
});

//login
router.post('/login', async (req,res) =>{
    const {error} = loginValidation(req.body);
    if(error){
        return res.status(400).json({error:error.details[0].message})
    }
    //check if user exists
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(400).json({error:"Email or password doesn't exists"});
    }
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass){
        res.status(400).json({error:"Invalid Password"})
    }
    else{
        
     console.log('it works')   
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET,{expiresIn: '3h'})
    res.header('Authorization', token);
    res.json({user:user,token:token});
    }
})

router.post('/review', auth, async (req,res) =>{
    User.findOne({ _id: req.user._id }, async function(err, user) {
        if (!user) {
          
          return res.status(400)({error: 'No account with that email address exists.'})
        }
    console.log(req.body)
    const error = reviewValidation(req.body);
    
    if(error){
        return res.status(400).json({error:error.details[0].message})
    }
    else if( !['Bad','Good','Superb'].includes(req.body.quality)){
        console.log('yep')
        return res.status(400).json({
            quality: "Please rate the quality of the apartment , either Bad, Good or Superb"
        })
    }
    else{
    const review = await Review.create({
        body: req.body.body,
        environment: req.body.environment,
        apartment: req.body.apartment,
        createdBy: req.user,
        landlord: req.body.landlord,
        quality: req.body.quality
    })
    console.log('it works haha')
    user.reviews.push(review);
    console.log(user)

    user.save() .then(user => {
        res.status(200).json({
            success: "successfully sent your review",
            user:user})
      })
      .catch(err =>{
        return res.status(400)({error: err})
      });
 
    }
});
})
//logout
router.get('/logout',auth,function(req,res){
    console.log(req.header("Authorization"))
    const blacktoken = new Blacklist({
        token: req.header("Authorization")
    })
    try{
        blacktoken.save();
        res.status(200).json({
            user : "logged out successfully"
        });

    }catch(err){
        res.status(400).json(err)
    }
    
    });





module.exports = router;