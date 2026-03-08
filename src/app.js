const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const applicationRoutes = require('./routes/application.routes');
const adminRoutes = require('./routes/admin.routes');
const contactRoutes = require("./routes/contact.routes");
const statsRoutes = require("./routes/stats.routes");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use('/api/auth',authRoutes);
app.use('/api/application',applicationRoutes);
app.use('/api/admin',adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/stats", statsRoutes);

module.exports = app;