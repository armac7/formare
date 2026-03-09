import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

export default session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Set to true if using HTTPS
});