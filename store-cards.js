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

  const CardSchema = new mongoose.Schema({
    brand: String,   // e.g. "Amazon Pay", "Flipkart", "Google Play"
    value: Number,   // e.g. 5000, 2000
    count: Number    // how many vouchers of this type
  });

  const Card = mongoose.models.Card || mongoose.model("Card", CardSchema);

  if (req.method === "POST") {
    try {
      const cards = Array.isArray(req.body) ? req.body : [req.body];
      await Card.insertMany(cards);
      res.status(200).json({ message: "Gift cards stored!" });
    } catch (err) {
      res.status(500).json({ message: "Error storing cards", error: err.message });
    }
  } else if (req.method === "GET") {
    try {
      const cards = await Card.find();
      res.status(200).json(cards);
    } catch (err) {
      res.status(500).json({ message: "Error fetching cards", error: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
