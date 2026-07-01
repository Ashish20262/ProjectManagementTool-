const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data',
      errors: [`${err.path} must be a valid identifier`],
    });
  }

  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {}).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry detected',
      errors: [`Duplicate value for field(s): ${fields}`],
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || undefined,
  });
};

export default errorHandler;