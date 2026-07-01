import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }
  return secret;
};

export const generateToken = (id) => {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id }, secret, {
    expiresIn,
  });
};

export const verifyToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};
