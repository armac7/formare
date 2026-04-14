import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

export default session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: false 
    } // Set to true if using HTTPS
});

export async function loggedIn(req, res) {
    // console.log(req.session.user);
    if (req.session.user) 
    {
        res.status(200).json({ loggedIn: true, username: req.session.user.username });
    }
    else 
    {
        res.status(401).json({ loggedIn: false });
    }
}

export async function requiredAuth(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect('/login.html');
    } 

    next();
};
