import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

export async function deleteUser(req, res) {
  try {
    console.log("Delete User Request: ", req.session.user); // Log the session user for debugging
    const username = req.session.user.username;
      
    await mongoose.connection.db.collection('users').deleteOne({ username });
    console.log(`User deleted: ${username}`);
    req.session.destroy(err => {
      if (err) {
        console.error("Session destroy error: ", err);
        return res.status(500).json({success: false});
      }

      res.clearCookie("connect.sid");

      res.status(200).json({message: 'User deleted successfully'});
    });
  } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ message: 'Error deleting user' });
  }
}

export async function register(req, res) {
  const { username, password, confirmPassword } = req.body;

  // Check if username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).send('Username already exists');
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  // Hash the password and save the new user to the database
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.send('Registration successful');
};