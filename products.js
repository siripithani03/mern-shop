const router = require('express').Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// List (with optional ?search= and ?category=)
router.get('/', async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category && category !== 'All') filter.category = category;
    res.json(await Product.find(filter).sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.get('/categories', async (req, res, next) => {
  try {
    res.json(await Product.distinct('category'));
  } catch (err) {
    next(err);
  }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    res.status(201).json(await Product.create(req.body));
  } catch (err) {
    err.name === 'ValidationError' ? res.status(400).json({ message: err.message }) : next(err);
  }
});

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
