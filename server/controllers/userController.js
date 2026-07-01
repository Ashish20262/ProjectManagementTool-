import User from '../models/User.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '_id name email');
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
