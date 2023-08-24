const db = require("../models");
const User = db.User
const Order = db.Order;
const bcrypt = require('bcryptjs')
const moment = require('moment')

// Create and Save a new Order
exports.create = async (req, res) => {
  const { amount, estimated_amount, network, product, wallet_address, toEmail } = req.body
  // Validate request
  if (!(amount && estimated_amount && network && product && wallet_address)) {
    res.status(400).json({ success: false, msg: "Content can not be empty!" });
    return;
  }

  const user = req.user
  const ref = makeid(4)
  const now = new Date()
  const start_time = moment(now).format('MM/DD/YYYY HH:mm:ss')
  // Create a Order
  const order = new Order({
    amount, estimated_amount, network, product, wallet_address,
    customer_name: user.name,
    from: user.email,
    to: toEmail,
    ref,
    start_time
  });

  // Save Order in the database
  order
    .save(order)
    .then(data => {
      res.status(201).json({ success: true, Order: data, msg: 'Order created successfully!' });
    })
    .catch(err => {
      res.status(500).send({
        msg:
          err.msg || "Some error occurred while creating the Order."
      });
    });
};

const makeid = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

exports.findAll = async (req, res) => {
  const orders = await Order.find()
  return res.status(200).json({ success: true, orders: orders })
}

// Update a Order by the id in the request
exports.updateStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body
  if (!(req.body && status)) {
    return res.status(400).json({
      msg: "Data to update can not be empty!"
    });
  }

  let order = await Order.findById(id)
  if (!order) {
    res.status(409).json({success: false, msg: 'Order does not exist!'})
  }
  order.status = status
  const now = new Date()
  const end_time = moment(now).format('MM/DD/YYYY HH:mm:ss')
  order.end_time = end_time
  order.transation_hash = bcrypt.hash(order.ref, 10)
  if (status == 'Finished') {
    let email = req.user.email
    let user = await User.findOne({email})
    user.transactions = user.transactions + 1
    await user.save()
  }
  await order.save()
  let orders = await Order.find()
  res.status(200).json({success: true, orders: orders, msg: `Order ${status} Successfully!`})
};

// Delete a Order with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Order.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          msg: `Cannot delete Order with id=${id}. Maybe Order was not found!`
        });
      } else {
        res.send({
          msg: "Order was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        msg: "Could not delete Order with id=" + id
      });
    });
};

// Delete all Orders from the database.
exports.deleteAll = (req, res) => {
  Order.deleteMany({})
    .then(data => {
      res.send({
        msg: `${data.deletedCount} Orders were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        msg:
          err.msg || "Some error occurred while removing all Orders."
      });
    });
};

// Find all published Orders
exports.findAllPublished = (req, res) => {
  Order.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        msg:
          err.msg || "Some error occurred while retrieving Orders."
      });
    });
};
