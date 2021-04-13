const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const Users = require('../models/users.schema');

router.get('/login', async (req, res) => {
    try {
        // Check if email exists
        const user = await Users.findOne({
            email: req.body.email,
        });
        if (!user) return res.status(401).json({ error: 'Invalid email' });

        // Check if password is correct
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(401).json({ error: 'Invalid password' });

        // Create and assign a token
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET /*{ expiresIn: "24h" }*/);
        res.header('auth-token', token).send(token);
    } catch (error) {
        res.status(+error.code).json({
            statusCode: +error.code,
            message: error.message,
        });
    }
});

module.exports = router;
