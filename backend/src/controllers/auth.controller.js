const jwt = require ("jsonwebtoken");
// const bcrypt = require('bcrypt');
const Admin = require('../models/Admin.model');

async function loginAdmin (req, res)  {
    
    try {
        const { email, password } = req.body;

        const user = await Admin.findOne({
            $or: [{ email: email, password: password }]
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // const isPasswordValid = 
        // if (!isPasswordValid) {
        //     return res.status(400).json({ message: 'Invalid credentials' });
        // }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
        res.status(200).json({ message: 'Login successful',
            user: { id: user._id, username: user.username, email: user.email } });
    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }}

    module.exports = { loginAdmin };