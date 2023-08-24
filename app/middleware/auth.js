const jwt = require("jsonwebtoken");

const config = process.env;

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (token) {

        jwt.verify(token, config.TOKEN_KEY, (err, user) => {
            if (err) {
                return res.status(401).json({ success: false, msg: 'You must login!' });
            }

            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ success: false, msg: 'You must login!' });
    }
};

module.exports = authenticateJWT;