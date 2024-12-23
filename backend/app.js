const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes.js");
// const qrCodeRoutes = require("./routes/authRoutes.js");
const dealRoutes = require("./routes/addDeals.js");
const userRoutes = require('./routes/addUserRoutes.js');
const qrCodeRoutes = require('./routes/qrCodeGenerate.js');
app.use(express.json());
const cors = require("cors");
app.use(cors());

app.use("/api/auth", authRoutes);

app.use("/api/qr-code", qrCodeRoutes);

app.use("/api/deals", dealRoutes);


app.use('/api/users', userRoutes);



app.use('/api/qr', qrCodeRoutes);

app.get("/", (req, res) => {
  res.send("Hello Deal Baba");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
