import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

export const generateToken = (user) => {
    return jwt.sign(
        { 
            userId: user.User_Id, 
            email: user.Email,
            role: user.Role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

export const authMiddleware = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Access denied. No token provided.' 
            });
        }

        // Check for Bearer token format
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Invalid token format. Use: Bearer <token>' 
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Access denied. No token provided.' 
            });
        }

        // Verify token
        const decoded = verifyToken(token);
        
        // Add user info to request object
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expired. Please login again.' 
            });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Invalid token.' 
            });
        }
        console.error('Auth middleware error:', err);
        return res.status(500).json({ 
            error: 'Internal server error during authentication.' 
        });
    }
};

/**
 * Optional auth middleware - doesn't fail if no token, but adds user info if present
 */
export const optionalAuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            if (token) {
                const decoded = verifyToken(token);
                req.userId = decoded.userId;
                req.userEmail = decoded.email;
            }
        }
        
        next();
    } catch (err) {
        // Token is invalid, but we continue without user info
        next();
    }
};

/**
 * Middleware to verify that the authenticated user matches the userId parameter
 * Must be used after authMiddleware
 */
export const verifyUserOwnership = (paramName = 'userId') => {
    return (req, res, next) => {
        const paramUserId = req.params[paramName];
        
        if (!req.userId) {
            return res.status(401).json({ 
                error: 'Authentication required.' 
            });
        }
        
        if (paramUserId && paramUserId !== req.userId) {
            return res.status(403).json({ 
                error: 'Access denied. You can only access your own resources.' 
            });
        }
        
        next();
    };
};

