const mongoose = require("mongoose");

let conn = null;

async function connectDB() {
  if (conn == null) {
    conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
  return conn;
}

module.exports = async (req, res) => {
  await connectDB();

  const UserSchema = new mongoose.Schema({ name: String, email: String });
  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  if (req.method === "POST") {
    const user = new User(req.body);
    await user.save();
    res.status(200).json({ message: "User saved!" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
