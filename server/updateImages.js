const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Update each product with a real, high-quality image
        const updates = [
            {
                title: "Smart Watch",
                imageUrl: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&h=600&fit=crop&q=80"
            },
            {
                title: "Yoga Mat",
                imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop&q=80"
            },
            {
                title: "Laptop Stand",
                imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop&q=80"
            },
            {
                title: "Running Shoes",
                imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=80"
            },
            {
                title: "Wireless Earbuds",
                imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&h=600&fit=crop&q=80"
            }
        ];

        for (const update of updates) {
            const result = await Product.updateOne(
                { title: update.title },
                { $set: { imageUrl: update.imageUrl } }
            );
            if (result.modifiedCount > 0) {
                console.log(`✅ Updated image for: ${update.title}`);
            } else {
                console.log(`⚠️  No match found for: ${update.title}`);
            }
        }

        mongoose.connection.close();
        console.log('Done! All product images updated.');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateImages();
