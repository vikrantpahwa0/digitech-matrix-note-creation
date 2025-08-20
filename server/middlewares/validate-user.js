const Joi = require("joi");

const validateUser = (req, res, next) => {
    const { error } = Joi.object({
        name: Joi.string().trim().required().messages({
          "string.empty": "Name is required",
        }),
        email: Joi.string().trim().email().required().messages({
          "string.empty": "Email is required",
          "string.email": "Email must be a valid email",
        }),
        password: Joi.string().required().messages({
          "string.empty": "Password is required",
          "string.min": "Password must be at least 6 characters long",
        }),
      }).validate(req.body, { abortEarly: false });
  
    if (error) {
      return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }  
    next();
  };

  const validateUserLogin = (req, res, next) => {
    const { error } = Joi.object({
        email: Joi.string().trim().email().required().messages({
          "string.empty": "Email is required",
          "string.email": "Email must be a valid email",
        }),
        password: Joi.string().required().messages({
          "string.empty": "Password is required",
          "string.min": "Password must be at least 6 characters long",
        }),
      }).validate(req.body, { abortEarly: false });
  
    if (error) {
      return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }  
    next();
  };
  
  module.exports = {
    validateUser,
    validateUserLogin
  };