const { getAuth } = require("firebase-admin/auth");
require("../config/firebase"); // Initializes Firebase
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const googleLogin = async (req, res) => {
  try {
    // Get Firebase ID Token
    const firebaseToken = req.headers.authorization.split(" ")[1];

    // Verify Firebase Token
    const decoded = await getAuth().verifyIdToken(firebaseToken);

    // Find existing user
    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    // Create user if not found
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        photoURL: decoded.picture,
        provider: "google",
      });
    }

    // Generate YOUR application's JWT
    const jwtToken = generateToken(user);

    // Return response
    res.status(200).json({
      message: "Login Successful",
      token: jwtToken,
      user,
    });

  } catch (error) {
    console.error(error);

    res.status(401).json({
      message: "Authentication Failed",
    });
  }
};

module.exports = {
  googleLogin,
};