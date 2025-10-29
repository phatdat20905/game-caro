// src/middleware/error.middleware.js
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.errors[0].message });
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: 'Username already exists' });
  }

  res.status(500).json({ error: 'Internal server error' });
};