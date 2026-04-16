import express from 'express';
import { login, logout } from "../controllers/authControllers.js";

const router = express.Router();

router.get('/auth', (req, res) => {
    // console.log('Checking auth status for session:', req.session.user);
    if (req.session.user) {
        res.status(200).json({ loggedIn: true, username: req.session.user.username });
    } else {
        res.status(401).json({ loggedIn: false });
    }
});
router.post('/auth/login', login);
router.post('/auth/logout', logout);

export default router;