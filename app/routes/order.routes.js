const auth = require('../middleware/auth')

module.exports = app => {
    const order = require("../controllers/order.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Order
    router.post("/", auth, order.create);
  
    // Retrieve all Order
    router.get("/", auth, order.findAll);

    router.post("/updateStatus/:id", auth, order.updateStatus);
  
    // // Retrieve all published order
    // router.get("/published", order.findAllPublished);
  
    // // Retrieve a single Tutorial with id
    // router.get("/:id", order.findOne);
  
    // // Update a Tutorial with id
    // router.put("/:id", order.update);
  
    // // Delete a Tutorial with id
    // router.delete("/:id", order.delete);
  
    // // Create a new Tutorial
    // router.delete("/", order.deleteAll);
  
    app.use("/api/order", router);
  };
  