import jwt from "jsonwebtoken";
import User from "../models/User.js";  // Make sure this is correct
import bcrypt from "bcryptjs";
export const login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.status(200).json({
        token,
        role: user.role, // Include role in the response
        message: "Login successful",
      });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error: error.message });
    }
  };
  

export const registerSuperAdmin = async (req, res) => {
    try {
      // Extract user details from request body
      const { username, password } = req.body;
  
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      // Check if superadmin already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Super Admin already exists!' });
      }
  
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new superadmin user
      const superAdmin = new User({
        username,
        password: hashedPassword,
        role: 'superadmin', // Ensure the role is 'superadmin'
      });
  
      // Save the user to the database
      const savedSuperAdmin = await superAdmin.save();
      console.log('Super Admin saved:', savedSuperAdmin);
  
      // Generate JWT token
      const token = jwt.sign(
        { id: savedSuperAdmin._id, username: savedSuperAdmin.username },
        process.env.JWT_SECRET, // Ensure your JWT_SECRET is in your .env
        { expiresIn: '1h' }
      );
  
      // Send response with success message and JWT token
      res.status(201).json({
        message: 'Super Admin registered successfully!',
        token,
      });
    } catch (error) {
      console.error('Error registering super admin:', error);
      res.status(500).json({
        message: 'Error registering super admin',
        error: error.message,
      });
    }
  };

  export const registerGateAdmin = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user with role 'gateadmin'
      const newGateAdmin = new User({
        username,
        password: hashedPassword,
        role: 'gateadmin',
        // Don't set email for gateadmin, as it's optional now
      });
  
      // Save the gateadmin user
      await newGateAdmin.save();
  
      res.status(201).json({
        message: 'Gateadmin registered successfully',
        user: { username: newGateAdmin.username, role: newGateAdmin.role },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error registering gateadmin', error: error.message });
    }
  };
  // Get all users with role 'gateadmin'
export const getAllGateAdmins = async (req, res) => {
  try {
    const gateAdmins = await User.find({ role: "gateadmin" }, "username"); // Fetch only usernames
    res.status(200).json({ gateAdmins });
  } catch (error) {
    res.status(500).json({ message: "Error fetching gate admins", error: error.message });
  }
};
