const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');
dotenv.config();

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.updateOne(
        { title: 'Wireless Headphones' },
        { $set: { imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&h=600&fit=crop&q=80' } }
    );
    console.log('Updated Wireless Headphones image');
    mongoose.connection.close();
})();
