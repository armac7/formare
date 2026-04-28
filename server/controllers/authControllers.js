import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

/*
* login(req, res)
*
* purpose: Authenticates a user by verifying their username and password. 
* If successful, it creates a session for the user.
*
* param {Object} req - The request object containing the username and password in the body.
* param {Object} res - The response object for sending the authentication result back to the client.
*/
export async function login(req, res) {
  const { username, password } = req.body;

  // Find the user in the database by their username. If the user doesn't exist, return an error response.
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password." });
  }

  // Compare the provided password with the hashed password stored in the database using bcrypt. 
  // If they don't match, return an error response.
  const match = await bcrypt.compare(password, user.password);
    
  if (!match) {
    return res.status(401).json({ success: false, message: "Invalid username or password." });
  }

  // create session
  req.session.user = { id: user._id, username: user.username };
  req.session.save();
  // console.log('User logged in:', req.session.user); // Log the session user for debugging
  res.json({ success: true, username: req.session.user.username, token: req.sessionID });
};

/* 
* logout(req, res)
*
* purpose: Logs out the user by destroying their session and clearing the session cookie.
*
* param {Object} req - The request object containing the user's session information.
* param {Object} res - The response object for sending the logout result back to the client.
*/
export async function logout(req, res) 
{
  // Destroy the user's session to log them out. 
  // If there's an error during session destruction, log the error and return a failure response.
  req.session.destroy(err => {
    if (err) {
      console.error("Session destroy error: ", err);
      return res.status(500).json({success: false});
    }

    res.clearCookie("connect.sid");

    res.status(200).json({success: true});
  });
}