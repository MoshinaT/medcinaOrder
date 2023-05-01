exports.userSignupValidator = (req, res, next) => {
  req.check('name', 'Name is required').notEmpty();
  req.check('password', 'Password is required').notEmpty();
  req
    .check('password')
    .isLength({ min: 4 })
    .withMessage('Password must contain at least 6 characters');
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
