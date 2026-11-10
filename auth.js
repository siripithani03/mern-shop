const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const payload = (user) => ({
  token: sign(user),
  user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
});

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: 'This email is already registered. Try logging in.' });
    const user = await User.create({ name, email, password });
    res.status(201).json(payload(user));
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await user.matchPassword(password || '')))
      return res.status(401).json({ message: 'Wrong email or password' });
    res.json(payload(user));
  } catch (err) {
    next(err);
  }
});

router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;
