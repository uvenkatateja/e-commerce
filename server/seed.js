const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Check if admin exists
        const admin = await User.findOne({ email: 'admin@ecommerce.com' });
        if (!admin) {
            console.log('Admin user NOT found. Creating now...');
            await User.create({
                name: 'Admin User',
                email: 'admin@ecommerce.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists.');
        }

        // 2. Refresh products if empty (optional but good for a fresh start)
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            console.log('No products found. Seeding test products...');
            await Product.create([
                {
                    title: "Smart Watch",
                    description: "Premium health and fitness tracker with AMOLED display and heart rate monitoring.",
                    price: 199.99,
                    category: "Electronics",
                    stockQuantity: 50,
                    imageUrl: "https://placehold.co/400x400/e2e8f0/1e293b?text=Smart+Watch"
                },
                {
                    title: "Yoga Mat",
                    description: "Eco-friendly, non-slip thick yoga mat for maximum comfort and grip.",
                    price: 34.99,
                    category: "Fitness",
                    stockQuantity: 120,
                    imageUrl: "https://placehold.co/400x400/e2e8f0/1e293b?text=Yoga+Mat"
                },
                {
                    title: "Laptop Stand",
                    description: "Ergonomic aluminum laptop stand with adjustable height and heat dissipation.",
                    price: 49.99,
                    category: "Electronics",
                    stockQuantity: 15,
                    imageUrl: "https://placehold.co/400x400/e2e8f0/1e293b?text=Laptop+Stand"
                },
                {
                    title: "Running Shoes",
                    description: "Lightweight, breathable running shoes designed for maximum speed and comfort.",
                    price: 129.99,
                    category: "Footwear",
                    stockQuantity: 80,
                    imageUrl: "https://placehold.co/400x400/e2e8f0/1e293b?text=Running+Shoes"
                },
                {
                    title: "Wireless Earbuds",
                    description: "True wireless earbuds with active noise cancellation and 30-hour battery life.",
                    price: 159.99,
                    category: "Electronics",
                    stockQuantity: 5,
                    imageUrl: "https://placehold.co/400x400/e2e8f0/1e293b?text=Headphones"
                }
            ]);
            console.log('Products seeded successfully.');
        } else {
            console.log(`Found ${productCount} products in database.`);
        }

        mongoose.connection.close();
        console.log('Seeding complete.');
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seed();
