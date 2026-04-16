import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { BodyStatus } from '../models/BodyStatus.js';

export async function getUserData(req, res) {
  if (req.session.user) {
    const { username } = req.session.user;
    const user = await User.findOne({ username });

    if (user) {
      res.json({ loggedIn: true, username: user.username });
    } else {
      res.json({ loggedIn: false });
    }
  }
}

export async function deleteUser(req, res) {
  try {
    console.log("(deleteUser backend function) Delete User Request: ", req.session.user); // Log the session user for debugging
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

export async function editUser(req, res) {
  try {
    const { username } = req.session.user;
    const { username: newUsername, password: newPassword } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (newUsername) {
      user.username = newUsername;
    }
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();
    req.session.user.username = user.username;

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export async function register(req, res) {
  try {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, username });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}