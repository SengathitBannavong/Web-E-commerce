import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Database configuration
export const DATABASE_URL = process.env.DATABASE_URL;

// Server configuration
export const PORT = process.env.PORT || 3000;

// CORS configuration - comma-separated list of allowed origins
export const CORS_ORIGINS = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'http://127.0.0.1:5173'];

// JWT configuration
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Admin configuration
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';
export const ADMIN_NAME = process.env.ADMIN_NAME || 'System Admin';
export const ADMIN_ROLE = 4012; // 0xFAC - Admin role bitwise value

// Stripe configuration
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET','STRIPE_SECRET_KEY','CLOUDINARY_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error(`[ERROR] Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.error('[ERROR] Please check your .env file');
    process.exit(1);
}

console.log('[INFO] Environment variables loaded successfully');

/**
 * Initialize admin user if not exists
 * Call this function after database is connected
 */
export const initializeAdmin = async (models) => {
    const { User } = models;
    
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ 
            where: { Email: ADMIN_EMAIL } 
        });
        
        if (existingAdmin) {
            console.log('[INFO] Admin user already exists');
            return existingAdmin;
        }
        
        // Generate Admin User_Id
        const lastUser = await User.findOne({
            order: [['Index', 'DESC']]
        });
        
        let nextNumber = 1;
        if (lastUser && lastUser.User_Id) {
            const lastNumber = parseInt(lastUser.User_Id.replace(/\D/g, ''));
            nextNumber = lastNumber + 1;
        }
        const adminUserId = `U${String(nextNumber).padStart(7, '0')}`;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        
        // Create admin user
        const admin = await User.create({
            User_Id: adminUserId,
            Name: ADMIN_NAME,
            Email: ADMIN_EMAIL,
            Password: hashedPassword,
            Address: 'System Administrator',
            PhoneNumber: '+0-000-0000',
            Gender: 'Other',
            Role: ADMIN_ROLE
        });
        
        console.log(`[INFO] Admin user created successfully (${adminUserId})`);
        return admin;
        
    } catch (error) {
        console.error('[ERROR] Failed to initialize admin:', error.message);
        throw error;
    }
};

export default {
    DATABASE_URL,
    PORT,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_NAME,
    ADMIN_ROLE,
    initializeAdmin
};
