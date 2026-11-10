const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// Place an order. Prices are read from the DB, never trusted from the browser.
router.post('/', protect, async (req, res, next) => {
  try {
    const { items, address } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: 'Your cart is empty' });
    if (!address) return res.status(400).json({ message: 'Delivery address is required' });

    const lines = [];
    let total = 0;
    for (const it of items) {
      const p = await Product.findById(it.product);
      const qty = Number(it.qty) || 1;
      if (!p) return res.status(400).json({ message: 'A product in your cart no longer exists' });
      if (p.stock < qty) return res.status(400).json({ message: `Only ${p.stock} left of ${p.name}` });
      lines.push({ product: p._id, name: p.name, price: p.price, qty });
      total += p.price * qty;
    }
    for (const l of lines) await Product.findByIdAndUpdate(l.product, { $inc: { stock: -l.qty } });

    const order = await Order.create({ user: req.user._id, items: lines, total, address });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get('/mine', protect, async (req, res, next) => {
  try {
    res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    res.json(await Order.find().populate('user', 'name email').sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.put('/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    res.json(await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
