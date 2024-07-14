const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/LogInSignUp", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

const LogInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensuring unique emails
  },
  password: {
    type: String,
    required: true
  }
});

const collection = mongoose.model("Collection1", LogInSchema);

module.exports = collection;
