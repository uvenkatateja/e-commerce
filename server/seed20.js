const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');
dotenv.config();

const products = [
    // ─── ELECTRONICS ───────────────────────────────
    {
        title: "Smart Watch Pro",
        description: "Premium health and fitness tracker with AMOLED display, heart rate monitoring, and 7-day battery life.",
        price: 199.99,
        category: "electronics",
        stockQuantity: 50,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Wireless Earbuds",
        description: "True wireless earbuds with active noise cancellation, touch controls, and 30-hour battery life.",
        price: 149.99,
        category: "electronics",
        stockQuantity: 85,
        imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Bluetooth Speaker",
        description: "Portable waterproof speaker with 360-degree sound, deep bass, and 20-hour playtime.",
        price: 79.99,
        category: "electronics",
        stockQuantity: 120,
        imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Laptop Stand",
        description: "Ergonomic aluminum laptop stand with adjustable height and heat dissipation design.",
        price: 49.99,
        category: "electronics",
        stockQuantity: 60,
        imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Mechanical Keyboard",
        description: "RGB mechanical keyboard with hot-swappable switches, PBT keycaps, and USB-C connectivity.",
        price: 129.99,
        category: "electronics",
        stockQuantity: 35,
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop&q=80"
    },

    // ─── FOOTWEAR ──────────────────────────────────
    {
        title: "Running Shoes",
        description: "Lightweight breathable running shoes designed for maximum speed, comfort, and durability.",
        price: 129.99,
        category: "footwear",
        stockQuantity: 80,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Classic Sneakers",
        description: "Timeless white sneakers with premium leather upper and comfortable cushioned sole.",
        price: 89.99,
        category: "footwear",
        stockQuantity: 100,
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Hiking Boots",
        description: "Waterproof hiking boots with ankle support, grip sole, and breathable membrane technology.",
        price: 159.99,
        category: "footwear",
        stockQuantity: 45,
        imageUrl: "https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Casual Loafers",
        description: "Comfortable slip-on loafers made from genuine suede with memory foam insole.",
        price: 69.99,
        category: "footwear",
        stockQuantity: 70,
        imageUrl: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&h=600&fit=crop&q=80"
    },

    // ─── FITNESS ───────────────────────────────────
    {
        title: "Yoga Mat Premium",
        description: "Eco-friendly non-slip thick yoga mat for maximum comfort and grip during workouts.",
        price: 34.99,
        category: "fitness",
        stockQuantity: 150,
        imageUrl: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Dumbbell Set",
        description: "Adjustable dumbbell set with 5-25 lb range, rubber-coated for floor protection.",
        price: 199.99,
        category: "fitness",
        stockQuantity: 30,
        imageUrl: "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Resistance Bands",
        description: "Set of 5 resistance bands with varying tension levels for full-body workout training.",
        price: 24.99,
        category: "fitness",
        stockQuantity: 200,
        imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Water Bottle",
        description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12.",
        price: 29.99,
        category: "fitness",
        stockQuantity: 180,
        imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&q=80"
    },

    // ─── ACCESSORIES ───────────────────────────────
    {
        title: "Leather Backpack",
        description: "Premium genuine leather backpack with laptop compartment and multiple organizer pockets.",
        price: 149.99,
        category: "accessories",
        stockQuantity: 40,
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Sunglasses",
        description: "UV400 polarized sunglasses with lightweight titanium frame and scratch-resistant lenses.",
        price: 59.99,
        category: "accessories",
        stockQuantity: 90,
        imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Minimalist Wallet",
        description: "Ultra-slim RFID-blocking wallet crafted from full-grain leather with card slots and cash pocket.",
        price: 39.99,
        category: "accessories",
        stockQuantity: 110,
        imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Canvas Tote Bag",
        description: "Durable organic cotton canvas tote bag perfect for everyday carry and shopping.",
        price: 19.99,
        category: "accessories",
        stockQuantity: 250,
        imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop&q=80"
    },

    // ─── HOME ──────────────────────────────────────
    {
        title: "Scented Candle Set",
        description: "Luxury hand-poured soy wax candle set with lavender, vanilla, and sandalwood scents.",
        price: 44.99,
        category: "home",
        stockQuantity: 75,
        imageUrl: "https://images.unsplash.com/photo-1602607753498-4b95e4a9669b?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Desk Organizer",
        description: "Bamboo desktop organizer with compartments for pens, phone, and stationery items.",
        price: 34.99,
        category: "home",
        stockQuantity: 65,
        imageUrl: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=600&h=600&fit=crop&q=80"
    },
    {
        title: "Plant Pot Set",
        description: "Modern ceramic plant pot set in 3 sizes with drainage holes and bamboo saucers.",
        price: 42.99,
        category: "home",
        stockQuantity: 8,
        imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop&q=80"
    },
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Delete all existing products
        await Product.deleteMany({});
        console.log('Cleared all existing products');

        // Insert 20 new products
        const created = await Product.insertMany(products);
        console.log(`Successfully created ${created.length} products:`);
        created.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.title} ($${p.price}) [${p.category}]`);
        });

        mongoose.connection.close();
        console.log('\nDone! 20 products seeded with real images.');
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedProducts();
