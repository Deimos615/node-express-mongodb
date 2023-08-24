module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      customer_name: { type: String, required: true },
      from: { type: String, required: true },
      to: { type: String, required: true },
      product: { type: String, required: true },
      network: { type: String, required: true },
      amount: { type: Number, required: true },
      estimated_amount: { type: Number, required: true },
      wallet_address: { type: String, required: true },
      fee: { type: Number, required: true, default: 2 },
      ref: { type: String, required: true },
      status: { type: String, required: true, default: 'Ordered' },
      transaction_hash: { type: String, required: false },
      start_time: { type: String, required: true },
      end_time: { type: String, required: false },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Order = mongoose.model("order", schema);
  return Order;
};
