// this is middleware after authMiddleware to verify admin users
const adminMiddleware = (req, res, next) => {
    try {
        const userRole = req.userRole;

        if(userRole === undefined){
            return res.status(401).json({
                error: 'Access denied. No role information.'
            });
        }

        if(isNaN(userRole)){
            return res.status(400).json({
                error: 'Invalid role information.'
            });
        }

        // bitwise AND to check for admin role (0xFAC = 4012)
        if(!(userRole & 0xFAC)){
            return res.status(403).json({
                error: 'Access denied. Admins only.'
            });
        }

        // change data admin
        req.userId = req.params.id || '';
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
        console.error('Admin middleware error:', err);
        return res.status(500).json({ 
            error: 'Internal server error during admin authentication.' 
        });
    }
}

export { adminMiddleware };