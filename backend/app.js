const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const authRoutes = require("./routes/authRoutes.js");
// const qrCodeRoutes = require("./routes/authRoutes.js");
const dealRoutes = require("./routes/addDeals.js");
const userRoutes = require('./routes/addUserRoutes.js');
const qrCodeRoutes = require('./routes/qrCodeGenerate.js');
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use("/api/auth", authRoutes);

app.use("/api/qr-code", qrCodeRoutes);

app.use("/api/deals", dealRoutes);


app.use('/api/users', userRoutes);



app.use('/api/qr', qrCodeRoutes);

app.get("/", (req, res) => {
  res.send("Hello Deal Baba");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
