import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;

// Admin credentials from .env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';

// Store tokens and IDs for later use
let adminToken = '';
let userTokens = {};
let userIds = {};
let productIds = {};
let cartIds = {};
let orderIds = {};

// ==================== HELPER FUNCTIONS ====================

const api = async (method, endpoint, body = null, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}/api${endpoint}`, options);
        const data = await response.json();
        
        if (!response.ok) {
            console.error(`[ERROR] ${method} ${endpoint}:`, data.error || data);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error(`[ERROR] ${method} ${endpoint}:`, error.message);
        return null;
    }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== MOCK DATA ====================

// Regular users (Admin is created automatically by server from .env)
const users = [
    {
        Name: 'Alice Smith',
        Email: 'alice@example.com',
        Password: 'password123',
        Address: '123 Main St, New York, NY 10001',
        PhoneNumber: '+1-555-0101',
        Gender: 'Female'
    },
    {
        Name: 'Bob Johnson',
        Email: 'bob@example.com',
        Password: 'securepass123',
        Address: '456 Oak Ave, Los Angeles, CA 90001',
        PhoneNumber: '+1-555-0102',
        Gender: 'Male'
    },
    {
        Name: 'Charlie Brown',
        Email: 'charlie@example.com',
        Password: 'charliepass123',
        Address: '789 Pine Rd, Chicago, IL 60601',
        PhoneNumber: '+1-555-0103',
        Gender: 'Male'
    }
];

const categories = [
    { name: 'Fiction', description: 'Novels and fictional books' },
    { name: 'Science', description: 'Books about science and nature' },
    { name: 'Technology', description: 'Books about tech and programming' },
    { name: 'History', description: 'Books about historical events' },
    { name: 'Self-Help', description: 'Personal development and motivation' }
];

const products = [
    { Name: 'The Great Gatsby', Author: 'F. Scott Fitzgerald', Description: 'Classic novel by F. Scott Fitzgerald', Price: 200000, Category: 'Fiction' },
    { Name: '1984', Author: 'George Orwell', Description: 'Dystopian novel by George Orwell', Price: 300000, Category: 'Fiction' },
    { Name: 'To Kill a Mockingbird', Author: 'Harper Lee', Description: 'Novel by Harper Lee', Price: 250000, Category: 'Fiction' },
    { Name: 'A Brief History of Time', Author: 'Stephen Hawking', Description: 'Science book by Stephen Hawking', Price: 350000, Category: 'Science' },
    { Name: 'The Selfish Gene', Author: 'Richard Dawkins', Description: 'Book by Richard Dawkins', Price: 320000, Category: 'Science' },
    { Name: 'Learning JavaScript', Author: 'Ethan Brown', Description: 'Programming guide for JS beginners', Price: 700000, Category: 'Technology' },
    { Name: 'Clean Code', Author: 'Robert C. Martin', Description: 'A handbook of agile software craftsmanship', Price: 800000, Category: 'Technology' },
    { Name: 'Python Crash Course', Author: 'Eric Matthes', Description: 'Hands-on introduction to Python', Price: 650000, Category: 'Technology' },
    { Name: 'Sapiens', Author: 'Yuval Noah Harari', Description: 'A brief history of humankind', Price: 400000, Category: 'History' },
    { Name: 'Atomic Habits', Author: 'James Clear', Description: 'Build good habits, break bad ones', Price: 380000, Category: 'Self-Help' }
];

// ==================== INITIALIZATION FUNCTIONS ====================

async function registerUsers() {
    console.log('\n[INFO] Registering users...');
    
    for (const user of users) {
        const result = await api('POST', '/users/register', user);
        
        if (result && result.user) {
            userIds[user.Email] = result.user.User_Id;
            userTokens[user.Email] = result.token;
            console.log(`  [OK] Registered: ${user.Name} (${result.user.User_Id})`);
        }
    }
}

async function loginAdmin() {
    console.log('\n[INFO] Logging in admin...');
    
    const result = await api('POST', '/users/login', {
        Email: ADMIN_EMAIL,
        Password: ADMIN_PASSWORD
    });
    
    if (result && result.token) {
        adminToken = result.token;
        userIds[ADMIN_EMAIL] = result.user.User_Id;
        userTokens[ADMIN_EMAIL] = result.token;
        console.log(`  [OK] Logged in as Admin: ${result.user.Name}`);
    } else {
        console.error('  [ERROR] Failed to login as admin. Check ADMIN_EMAIL and ADMIN_PASSWORD in .env');
    }
}

async function loginUsers() {
    console.log('\n[INFO] Logging in users...');
    
    for (const user of users) {
        const result = await api('POST', '/users/login', {
            Email: user.Email,
            Password: user.Password
        });
        
        if (result && result.token) {
            userIds[user.Email] = result.user.User_Id;
            userTokens[user.Email] = result.token;
            console.log(`  [OK] Logged in: ${user.Name}`);
        }
    }
}

async function createCategories() {
    console.log('\n[INFO] Creating categories...');
    
    if (!adminToken) {
        console.log('  [WARN] No admin token, skipping categories (need admin permission)');
        return;
    }
    
    for (const category of categories) {
        const result = await api('POST', '/categories', category, adminToken);
        
        if (result) {
            console.log(`  [OK] Created category: ${category.name}`);
        }
    }
}

async function getCategories() {
    console.log('\n[INFO] Fetching categories...');
    
    const result = await api('GET', '/categories');
    
    if (result && result.data) {
        const categoryMap = {};
        result.data.forEach(cat => {
            categoryMap[cat.Name] = cat.Category_Id;
        });
        console.log(`  [OK] Found ${result.data.length} categories`);
        return categoryMap;
    }
    
    return {};
}

async function createProducts(categoryMap) {
    console.log('\n[INFO] Creating products...');
    
    if (!adminToken) {
        console.log('  [WARN] No admin token, skipping products (need admin permission)');
        return;
    }
    
    for (const product of products) {
        const categoryId = categoryMap[product.Category];
        
        const productData = {
            Name: product.Name,
            Author: product.Author,
            Description: product.Description,
            Price: product.Price,
            Category_Id: categoryId,
            Photo_Id: `photo_${product.Name.toLowerCase().replace(/\s+/g, '_')}`
        };
        
        const result = await api('POST', '/products', productData, adminToken);
        
        if (result) {
            productIds[product.Name] = result.Product_Id;
            console.log(`  [OK] Created product: ${product.Name} (VND ${product.Price})`);
        }
    }
}

async function getProducts() {
    console.log('\n[INFO] Fetching products...');
    
    const result = await api('GET', '/products');
    
    if (result && result.data) {
        result.data.forEach(prod => {
            productIds[prod.Name] = prod.Product_Id;
        });
        console.log(`  [OK] Found ${result.data.length} products`);
    }
}

async function createStocks() {
    console.log('\n[INFO] Creating stock for products...');
    
    if (!adminToken) {
        console.log('  [WARN] No admin token, skipping stocks (need admin permission)');
        return;
    }
    
    // Stock quantities for each product
    const stockData = {
        'The Great Gatsby': 50,
        '1984': 45,
        'To Kill a Mockingbird': 30,
        'A Brief History of Time': 25,
        'The Selfish Gene': 20,
        'Learning JavaScript': 100,
        'Clean Code': 75,
        'Python Crash Course': 80,
        'Sapiens': 60,
        'Atomic Habits': 90
    };
    
    for (const [productName, quantity] of Object.entries(stockData)) {
        const productId = productIds[productName];
        
        if (productId) {
            const result = await api('POST', '/stocks', {
                productId: productId,
                quantity: quantity
            }, adminToken);
            
            if (result) {
                console.log(`  [OK] Created stock for ${productName}: ${quantity} units`);
            }
        } else {
            console.log(`  [WARN] Product not found: ${productName}`);
        }
    }
}

async function createCarts() {
    console.log('\n[INFO] Creating carts and adding items...');
    
    // Cart for Alice
    const aliceToken = userTokens['alice@example.com'];
    const aliceId = userIds['alice@example.com'];
    
    if (aliceToken && aliceId) {
        // Create cart
        const cart = await api('POST', '/carts', { User_Id: aliceId }, aliceToken);
        
        if (cart && cart.data) {
            cartIds['alice'] = cart.data.Cart_Id;
            console.log(`  [OK] Created cart for Alice`);
            
            // Add items to cart
            const items = [
                { productName: 'The Great Gatsby', quantity: 1 },
                { productName: 'Learning JavaScript', quantity: 2 }
            ];
            
            for (const item of items) {
                const productId = productIds[item.productName];
                if (productId) {
                    await api('POST', `/carts/items/${cart.data.Cart_Id}`, {
                        Product_Id: productId,
                        Quantity: item.quantity
                    }, aliceToken);
                    console.log(`    [+] Added ${item.quantity}x ${item.productName}`);
                }
            }
        }
    }
    
    // Cart for Bob
    const bobToken = userTokens['bob@example.com'];
    const bobId = userIds['bob@example.com'];
    
    if (bobToken && bobId) {
        const cart = await api('POST', '/carts', { User_Id: bobId }, bobToken);
        
        if (cart && cart.data) {
            cartIds['bob'] = cart.data.Cart_Id;
            console.log(`  [OK] Created cart for Bob`);
            
            const productId = productIds['A Brief History of Time'];
            if (productId) {
                await api('POST', `/carts/items/${cart.data.Cart_Id}`, {
                    Product_Id: productId,
                    Quantity: 1
                }, bobToken);
                console.log(`    [+] Added 1x A Brief History of Time`);
            }
        }
    }
}

async function createOrders() {
    console.log('\n[INFO] Creating orders...');
    
    // Order for Alice
    const aliceToken = userTokens['alice@example.com'];
    const aliceId = userIds['alice@example.com'];
    
    if (aliceToken && aliceId) {
        const order = await api('POST', `/orders/${aliceId}`, {
            Status: 'pending',
            Amount: 1600000,
            Shipping_Address: users.find(u => u.Email === 'alice@example.com')?.Address || ''
        }, aliceToken);
        
        if (order && order.data) {
            orderIds['alice'] = order.data.Order_Id;
            console.log(`  [OK] Created order for Alice (Order #${order.data.Order_Id})`);
            
            // Add order items
            const items = [
                { productName: 'The Great Gatsby', quantity: 1, amount: 200000 },
                { productName: 'Learning JavaScript', quantity: 2, amount: 1400000 }
            ];
            
            for (const item of items) {
                const productId = productIds[item.productName];
                if (productId) {
                    await api('POST', `/orders/items/${order.data.Order_Id}`, {
                        Product_Id: productId,
                        Quantity: item.quantity,
                        Amount: item.amount
                    }, aliceToken);
                    console.log(`    [+] Added ${item.quantity}x ${item.productName}`);
                }
            }
        }
    }
    
    // Order for Bob
    const bobToken = userTokens['bob@example.com'];
    const bobId = userIds['bob@example.com'];
    
    if (bobToken && bobId) {
        const order = await api('POST', `/orders/${bobId}`, {
            Status: 'pending',
            Amount: 350000,
            Shipping_Address: users.find(u => u.Email === 'bob@example.com')?.Address || ''
        }, bobToken);
        
        if (order && order.data) {
            orderIds['bob'] = order.data.Order_Id;
            console.log(`  [OK] Created order for Bob (Order #${order.data.Order_Id})`);
            
            const productId = productIds['A Brief History of Time'];
            if (productId) {
                await api('POST', `/orders/items/${order.data.Order_Id}`, {
                    Product_Id: productId,
                    Quantity: 1,
                    Amount: 350000
                }, bobToken);
                console.log(`    [+] Added 1x A Brief History of Time`);
            }
        }
    }
}

async function createPayments() {
    console.log('\n[INFO] Creating payments...');
    
    // Payment for Alice's order
    const aliceToken = userTokens['alice@example.com'];
    const aliceOrderId = orderIds['alice'];
    
    if (aliceToken && aliceOrderId) {
        const payment = await api('POST', '/payments', {
            orderId: aliceOrderId,
            userId: userIds['alice@example.com'],
            type: 'credit_card',
            amount: 1600000,
            status: 'completed'
        }, aliceToken);
        
        if (payment) {
            console.log(`  [OK] Created payment for Alice's order (Credit Card - VND 1,600,000)`);
        }
    }
    
    // Payment for Bob's order
    const bobToken = userTokens['bob@example.com'];
    const bobOrderId = orderIds['bob'];
    
    if (bobToken && bobOrderId) {
        const payment = await api('POST', '/payments', {
            orderId: bobOrderId,
            userId: userIds['bob@example.com'],
            type: 'paypal',
            amount: 350000,
            status: 'pending'
        }, bobToken);
        
        if (payment) {
            console.log(`  [OK] Created payment for Bob's order (PayPal - VND 350,000)`);
        }
    }
}

// ==================== MAIN ====================

async function main() {
    console.log('Starting Mock Data Initialization...');
    console.log(`Server URL: ${BASE_URL}`);
    console.log('='.repeat(50));
    
    // Check if server is running
    try {
        const response = await fetch(`${BASE_URL}/`);
        if (!response.ok) {
            throw new Error('Server not responding');
        }
        console.log('[OK] Server is running!');
    } catch (error) {
        console.error('[ERROR] Cannot connect to server. Make sure the server is running!');
        console.error('   Run: npm run dev');
        process.exit(1);
    }
    
    // Initialize data
    // Login admin first (created automatically by server)
    await loginAdmin();
    await delay(500);
    
    await registerUsers();
    await delay(500);
    
    await loginUsers();
    await delay(500);
    
    await createCategories();
    await delay(500);
    
    const categoryMap = await getCategories();
    await delay(500);
    
    await createProducts(categoryMap);
    await delay(500);
    
    await getProducts();
    await delay(500);
    
    await createStocks();
    await delay(500);
    
    // await createCarts();
    // await delay(500);
    
    // await createOrders();
    // await delay(500);
    
    // await createPayments();
    
    console.log('\n[DONE] Mock data initialization completed!');
    console.log('\nSummary:');
    console.log(`   Users: ${Object.keys(userIds).length}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Products: ${Object.keys(productIds).length}`);
    console.log(`   Stocks: ${Object.keys(productIds).length}`);
    console.log(`   Carts: ${Object.keys(cartIds).length}`);
    console.log(`   Orders: ${Object.keys(orderIds).length}`);
    
    console.log('\nTest Credentials:');
    console.log('   User:  alice@example.com / password123');
    console.log('   User:  bob@example.com / securepass123');
}

main().catch(console.error);
