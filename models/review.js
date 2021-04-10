const { string } = require("@hapi/joi");
const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({
body:{
    type: String
},
createdBy:{
    type: mongoose.Schema.Types.ObjectId , ref:'user'
},
//this will include the images and videos..we are saving the path location
attachements:{
    type: String
},
environment:{
    type: String
},
landlord:{
    type: String
},
quality:{
    type: String,
    enum: ['Bad','Good','Superb']
},
apartment:{
    type:String
}
})

module.exports = mongoose.model("review",reviewSchema);