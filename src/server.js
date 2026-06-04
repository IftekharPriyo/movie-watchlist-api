const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db').connectDB;
const disconnectDB = require('./config/db').disconnectDB;



// Import routes
const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');
connectDB();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the imported routes
app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);

app.get('/hello', (req, res) => {
    res.json({ message: 'Welcome to the Movie Watchlist API!' });
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  disconnectDB().then(() => {
    process.exit(1);
  });   

});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  disconnectDB().then(() => {
    server.close(() => {
      console.log("Server closed. Exiting process.");
      process.exit(0);
    });
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);   
  disconnectDB().then(() => {
    process.exit(1);
  })
});



