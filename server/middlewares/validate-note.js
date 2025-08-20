// middlewares/validateNote.js
const Joi = require("joi");

const noteSchema = Joi.object({
  title: Joi.string().max(255).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.max": "Title must not exceed 255 characters",
    "any.required": "Title is required",
  }),
  content: Joi.string().required().messages({
    "string.base": "Content must be a string",
    "string.empty": "Content is required",
    "any.required": "Content is required",
  }),
  viewers: Joi.array().items(Joi.number().integer()).optional(),
  editors: Joi.array().items(Joi.number().integer()).optional(),
});

const validateNoteAddition = (req, res, next) => {
  const { error } = noteSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      errors: error.details.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }

  next();
};

module.exports = { validateNoteAddition };
