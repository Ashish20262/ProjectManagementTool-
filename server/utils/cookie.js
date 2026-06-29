export const attachCookie = (res, token) => {
  const expiryDays = 7;
  const expires = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
  });
};
