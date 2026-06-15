const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware - allows JSON body and cross-origin requests from React
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));       // signup, login
app.use('/api/urls', require('./routes/url'));         // create, list, delete
app.use('/', require('./routes/redirect'));            // short URL redirect

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));