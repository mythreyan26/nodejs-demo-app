const express = require('express');

const app = express();

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to Elevate Labs DevOps Internship - Task 1 Demo App!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint for container/orchestrator health checks
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime()
  });
});

module.exports = app;
