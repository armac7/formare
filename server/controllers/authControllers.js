import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

export async function login(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  // console.log('Password encrypted in DB:', bcrypt.hash(password, 10)); // Log the encrypted password for debugging

  if (!user) {
    return res.status(401).send('Invalid username or password');
  }

  const match = await bcrypt.compare(password, user.password);
    
  if (!match) {
    return res.status(401).send('Invalid username or password');
  }

  // create session
  req.session.user = { id: user._id, username: user.username };
  req.session.save();
  // console.log('User logged in:', req.session.user); // Log the session user for debugging
  res.json({ success: true, username: req.session.user.username, token: req.sessionID });
};

export async function logout(req, res) 
{
  // console.log("Logout");
  req.session.destroy(err => {
    if (err) {
      console.error("Session destroy error: ", err);
      return res.status(500).json({success: false});
    }

    res.clearCookie("connect.sid");

    res.status(200).json({success: true});
  });
}