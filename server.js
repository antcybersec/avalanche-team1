const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Import routes
const agentRoutes = require('./routes/agents');
const ideaRoutes = require('./routes/ideas');
const tokenRoutes = require('./routes/tokens');

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/tokens', tokenRoutes);

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AI Company server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
