import bcrypt from "bcryptjs";
import { getModel } from "../config/database.js";
import { generateToken } from "../middleware/auth.js";

const SALT_ROUNDS = 10;

// Validation helper function
const validateUserFields = (fields, isUpdate = false) => {
    const { Name, Email, Password, Address, PhoneNumber, Gender } = fields;
    const errors = [];

    // Check required fields (only for create, not update)
    if (!isUpdate) {
        if (!Name) errors.push("Name is required");
        if (!Email) errors.push("Email is required");
        if (!Password) errors.push("Password is required");
        if (!Address) errors.push("Address is required");
        if (!PhoneNumber) errors.push("PhoneNumber is required");
        if (!Gender) errors.push("Gender is required");
    }

    // Check if at least one field is provided for update
    if (isUpdate && !Name && !Email && !Password && !Address && !PhoneNumber && !Gender) {
        errors.push("At least one field is required to update");
    }

    // Validate email format if provided
    if (Email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Email)) {
            errors.push("Invalid email format");
        }
    }

    // Validate field lengths if provided
    if (Name && Name.length > 64) {
        errors.push("Name must be 64 characters or less");
    }

    if (Address && Address.length > 256) {
        errors.push("Address must be 256 characters or less");
    }

    if (PhoneNumber && PhoneNumber.length > 256) {
        errors.push("PhoneNumber must be 256 characters or less");
    }

    if (Gender && Gender.length > 32) {
        errors.push("Gender must be 32 characters or less");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

const get_all_users = async (req, res) => {
    const { User } = getModel();
    
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    try {
        // Execute count and findAll in parallel
        const [total, users] = await Promise.all([
            User.count(),
            User.findAll({
                limit: limit,
                offset: offset
            })
        ]);
        
        const totalPage = Math.ceil(total / limit);
        
        res.json({
            totalPage,
            total,
            data: users
        });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const get_user = (req, res) => {
    const id = req.params.id;
    
    // If no ID provided, return all users (admin access verified by middleware)
    if (!id) {
        return get_all_users(req, res);
    }

    const { User } = getModel();
    
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

const generateUserId = async (User) => {
    const lastUser = await User.findOne({
        order: [['Index', 'DESC']]
    });

    let nextNumber = 1;
    if (lastUser && lastUser.User_Id) {
        const lastNumber = parseInt(lastUser.User_Id.replace(/\D/g, ''));
        nextNumber = lastNumber + 1;
    }

    return `U${String(nextNumber).padStart(7, '0')}`;
};

const create_user = async (req, res) => {
    const { Name, Email, Password, Address, PhoneNumber, Gender } = req.body;
    
    // Validate fields using helper function
    const validation = validateUserFields(req.body, false);
    if (!validation.isValid) {
        return res.status(400).json({ 
            error: "Validation failed",
            details: validation.errors,
            required: ["Name", "Email", "Password", "Address", "PhoneNumber", "Gender"]
        });
    }

    try {
      const { User } = getModel();
      
      // Check for existing email and generate User_Id in parallel
      const [existingUser, User_Id, hashedPassword] = await Promise.all([
        User.findOne({ where: { Email } }),
        generateUserId(User),
        bcrypt.hash(Password, SALT_ROUNDS)
      ]);
      
      // Handle duplicate email
      if (existingUser) {
        return res.status(409).json({ 
          error: "User with this email already exists" 
        });
      }
      
      // Create user with generated User_Id and hashed password
      const user = await User.create({
        User_Id,
        Name,
        Email,
        Password: hashedPassword,
        Address,
        PhoneNumber,
        Gender
      });

      // Generate JWT token
      const token = generateToken(user);
      
      // Return user data without password
      const userData = user.toJSON();
      delete userData.Password;
      
      res.status(201).json({
        message: "User registered successfully",
        user: userData,
        token
      });
    } catch (err) {
      console.error("Error creating user:", err);
      
      // 409 error for Duplicate Resource Creation
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ 
          error: "User with this email already exists" 
        });
      }
  
      res.status(500).json({ error: "Internal server error" });
    }
};


const delete_user = (req, res) => {
    const id = req.params.id;
    
    // Authentication and authorization handled by middleware
    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }
    const { User } = getModel();
    
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

const update_user = async (req, res) => {
    const id = req.userId;
    
    if (!id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    const { Name, Email, Password, Address, PhoneNumber, Gender } = req.body;

    // Validate fields using helper function (isUpdate = true)
    const validation = validateUserFields(req.body, true);
    if (!validation.isValid) {
        return res.status(400).json({ 
            error: "Validation failed",
            details: validation.errors,
            allowedFields: ["Name", "Email", "Password", "Address", "PhoneNumber", "Gender"]
        });
    }

    try {
        const { User } = getModel();

        // Check if user exists
        const user = await User.findOne({ where: { User_Id: id } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if email is already taken by another user
        if (Email && Email !== user.Email) {
            const existingUser = await User.findOne({ where: { Email } });
            if (existingUser) {
                return res.status(409).json({ error: "Email already in use by another user" });
            }
        }

        // Build update object with only provided fields
        const updateData = {};
        if (Name) updateData.Name = Name;
        if (Email) updateData.Email = Email;
        if (Password) updateData.Password = Password;
        if (Address) updateData.Address = Address;
        if (PhoneNumber) updateData.PhoneNumber = PhoneNumber;
        if (Gender) updateData.Gender = Gender;

        // Hash password if provided
        if (Password) {
            updateData.Password = await bcrypt.hash(Password, SALT_ROUNDS);
        }

        // Update user
        await User.update(updateData, { where: { User_Id: id } });

        // Fetch updated user
        const updatedUser = await User.findOne({ where: { User_Id: id } });

        // Remove password from response
        const userData = updatedUser.toJSON();
        delete userData.Password;

        res.json({
            message: "User updated successfully",
            data: userData
        });
    } catch (err) {
        console.error("Error updating user:", err);

        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: "Email already in use" });
        }

        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Login user with email and password
 */
const login_user = async (req, res) => {
    const { Email, Password } = req.body;

    // Validate required fields
    if (!Email || !Password) {
        return res.status(400).json({
            error: "Validation failed",
            details: ["Email and Password are required"]
        });
    }

    try {
        const { User } = getModel();

        // Find user by email
        const user = await User.findOne({ where: { Email } });

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(Password, user.Password);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Return user data without password
        const userData = user.toJSON();
        delete userData.Password;

        res.json({
            message: "Login successful",
            user: userData,
            token
        });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get current user profile (requires authentication)
 */
const get_current_user = async (req, res) => {
    try {
        const { User } = getModel();

        // userId comes from auth middleware
        const user = await User.findOne({ where: { User_Id: req.userId } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return user data without password
        const userData = user.toJSON();
        delete userData.Password;

        res.json(userData);
    } catch (err) {
        console.error("Error fetching current user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};


export { create_user, delete_user, get_current_user, get_user, login_user, update_user };
