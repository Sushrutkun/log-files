// index.js
const express = require('express');
const winston = require('winston');
const axios = require('axios');

const app = express();

// Configure Winston logger
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: 'logfile.log' }),
    new winston.transports.Console()
  ]
});

// Middleware to log API calls
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const method = req.method;
  const protocol = req.protocol;

  logger.info('API Call', {
    method,
    ip, // This will now log the public IP address of the client
    protocol,
    originalUrl: req.originalUrl,
  });

  next();
});

// Define a simple API endpoint
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Fetch the public IP address using Axios
app.get('/public-ip', async (req, res) => {
  try {
    const response = await axios.get('https://httpbin.org/ip');
    const publicIpAddress = response.data.origin;
    res.send(`Public IP Address: ${publicIpAddress}`);
  } catch (error) {
    logger.error('Error fetching public IP address:', error);
    res.status(500).send('Error fetching public IP address');
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
