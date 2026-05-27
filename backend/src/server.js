const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const initDB = require("./database/initDB");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
//Initialise DB
initDB();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);

app.get("/", (req, res) => {
  res.send("Expense Manager API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});