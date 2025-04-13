// middleware/authMiddleware.js
const admin = require("../firebaseAdmin");

const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    admin
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
            req.user = decodedToken; // Attach the user to the request
            next();
        })
        .catch((error) => {
            res.status(403).json({ message: "Forbidden: Invalid token" });
        });
};

module.exports = verifyFirebaseToken;
