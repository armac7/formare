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