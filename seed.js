// Run with: npm run seed   -> creates an admin user + sample products
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  ['Ceramic Pour-Over Set', 'Dripper and carafe for slow mornings.', 1899, 'Kitchen', 12],
  ['Linen Throw Blanket', 'Washed linen, soft from the first day.', 2499, 'Home', 8],
  ['Walnut Desk Tray', 'Holds pens, cables and loose change.', 999, 'Office', 20],
  ['Cast Iron Skillet', '10 inch, pre-seasoned.', 2199, 'Kitchen', 6],
  ['Beeswax Candle Trio', 'Hand poured, 30-hour burn each.', 799, 'Home', 25],
  ['Dot Grid Notebook', 'A5, 160 pages, lay-flat binding.', 349, 'Office', 40],
  ['Enamel Camp Mug', 'Light, tough, and keeps tea hot.', 449, 'Kitchen', 30],
  ['Brass Plant Mister', 'Fine spray for ferns and herbs.', 599, 'Home', 15],
].map(([name, description, price, category, stock]) => ({ name, description, price, category, stock }));

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany();
  await Product.insertMany(products);
  if (!(await User.findOne({ email: 'admin@shop.com' })))
    await User.create({ name: 'Admin', email: 'admin@shop.com', password: 'admin123', isAdmin: true });
  console.log('Seeded: 8 products + admin (admin@shop.com / admin123)');
  process.exit(0);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
