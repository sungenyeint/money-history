const admin = require("firebase-admin");
require("dotenv").config({ path: "../.env" }); // Load the .env file

// Parse the service account key from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Fix the private_key by replacing \\n with \n
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
