require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3500;

// connect DB
connectDB();

// middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// static files (optional)
app.use('/', express.static(path.join(__dirname, '/public')));

// STATES ROUTES
app.use('/states', require('./routes/api/states'));

// 404 handler
app.all('*', (req, res) => {
    res.status(404);
    
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    }
    else {
        res.type('txt').send("404 Not Found");
    }
});

// start server
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});