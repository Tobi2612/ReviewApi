//Validation 
const Joi = require("@hapi/joi");

const registerValidation = data =>{
const schema = Joi.object( {
    firstname: Joi.string()
                .required(),
    lastname: Joi.string()
                .required(),
    email: Joi.string()
                .required()
                .email(),
    password: Joi.string()
                .min(6)
                .required(),
    confirm_password: Joi.string()
                .min(6)
                .required(),

});
   return schema.validate(data);
};

const loginValidation = data =>{
    const schema = Joi.object( {
        email: Joi.string()
                .required()
                .email(),
        password: Joi.string()
                    .min(6)
                    .required(),   
    
    });
       return schema.validate(data);
    };
const  reviewValidation = data =>{
    const schema = Joi.object( {
        body: Joi.string()
                .required(),
        landlord: Joi.string()
                    .min(3)
                    .required(),   
        environment: Joi.string()
                    .required(),   
        quality: Joi.string()
                    .required(),
        apartment: Joi.string()
                    .required(),
    });

}
    

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.reviewValidation = reviewValidation;