const authMiddleware = require('../middleware/auth')

module.exports = app => {
    const auth = require("../controllers/auth.controller.js");
  
    var router = require("express").Router();
  
    // Create a new User
    router.post("/signup", auth.signup);

    // Login
    router.post("/login", auth.login);

    // Log Out
    router.get("/logout", auth.logout);

    // Auth check
    router.get("/check", authMiddleware, auth.check);
  
    app.use("/api/auth", router);
  };
  