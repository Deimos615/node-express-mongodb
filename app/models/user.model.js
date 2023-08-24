module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      email: { type: String, required: true },
      name: { type: String, required: true },
      type: { type: String, required: true, default: 'Regular' },
      status: { type: String, required: true, default: 'Normal' },
      transactions: { type: Number, required: true, default: 0 },
      amounts: { type: Number, required: true, default: 0 },
      password: { type: String, required: true },
      token: { type: String, required: false },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("user", schema);
  return User;
};
