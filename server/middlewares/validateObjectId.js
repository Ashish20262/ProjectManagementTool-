import mongoose from 'mongoose';

const validateObjectId = (paramName) => (req, res, next) => {
  const id = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid identifier',
      errors: [`${paramName} must be a valid id`],
    });
  }
  next();
};

export default validateObjectId;
