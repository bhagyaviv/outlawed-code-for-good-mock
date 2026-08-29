require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const healthRouter = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARES
// ==========================================

// Configure CORS
// To restrict origins, replace '*' with process.env.CLIENT_URL or other domain
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// JSON and Url-encoded parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROUTES
// ==========================================

// Health check endpoint
app.use('/api/health', healthRouter);

// --- HACKATHON PLACEHOLDERS ---
// Tomorrow, register custom route files here:
// const featureRoutes = require('./routes/features');
// app.use('/api/features', featureRoutes);

// Fallback 404 route for unmatched routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// ==========================================
// ERROR HANDLING
// ==========================================

// Global catch-all error handler (always place last)
app.use(errorHandler);

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Allowed Origin: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`========================================`);
});
