import { getDB } from "../config/database.js";
import { User as UserModel } from "../models/user_model.js";

const get_all_users = (req, res) => {
    const db = getDB();
    const User = UserModel(db);
    User.findAll()
    .then(users => {
        res.json(users);
    })
    .catch(err => {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal server error" });
    });
};

const generateUserId = async (User) => {
    const lastUser = await User.findOne({
        order: [['Index', 'DESC']]
    });

    let nextNumber = 1;
    if (lastUser && lastUser.User_Id) {
        const lastNumber = parseInt(lastUser.User_Id.replace(/\D/g, ''));
        nextNumber = lastNumber + 1;
    }

    return `USR${String(nextNumber).padStart(4, '0')}`;
};

const create_user = async (req, res) => {
    const { Name, Email, Password } = req.body;
    
    // Validate required fields (User_Id is now auto-generated)
    if (!Name || !Email || !Password) {
        return res.status(400).json({ 
            error: "Missing required fields",
            required: ["Name", "Email", "Password"]
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
        return res.status(400).json({ 
            error: "Invalid email format" 
        });
    }

    // Validate Name length (max 64 characters)
    if (Name.length > 64) {
        return res.status(400).json({ 
            error: "Name must be 64 characters or less" 
        });
    }

    try {
        const db = getDB();
        const User = UserModel(db);
        
        // Auto-generate User_Id
        const User_Id = await generateUserId(User);
        
        // Create user with generated User_Id
        const user = await User.create({
            User_Id,
            Name,
            Email,
            Password
        });
        
        res.status(201).json(user);
    } catch (err) {
        console.error("Error creating user:", err);
        
        // Handle unique constraint violations
        // 409 error for Duplicate Resource Creation
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ 
                error: "User with this email already exists" 
            });
        }
        
        res.status(500).json({ error: "Internal server error" });
    }
};

const get_user_by_id = (req, res) => {
    const id = req.query.id || req.params.id;
    
    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    const db = getDB();
    const User = UserModel(db);
    
    User.findOne({ where: { User_Id: id } })
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    })
    .catch(err => {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Internal server error" });
    });
};

const delete_user = (req, res) => {
    const id = req.params.id || req.query.id;
    const auth = req.params.auth || req.query.auth;

    // temporary simple auth check
    if(auth !== "admin123") {
        console.error("Unauthorized delete attempt:", { id, auth });
        return res.status(403).json({ error: "Unauthorized action" });
    }

    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }
    const db = getDB();
    const User = UserModel(db);
    
    User.destroy({ where: { User_Id: id } })
    .then(deletedCount => {
        if (deletedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    })
    .catch(err => {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Internal server error" });
    });
};

export { create_user, delete_user, get_all_users, get_user_by_id };

