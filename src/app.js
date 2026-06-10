const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const applicationRoutes = require("./routes/application.routes");
const adminRoutes = require("./routes/admin.routes");
const contactRoutes = require("./routes/contact.routes");
const statsRoutes = require("./routes/stats.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// Serve Graphify analytics dashboard
app.use("/graphify", express.static(path.join(__dirname, "graphify")));

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
