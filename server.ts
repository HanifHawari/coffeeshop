import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/backend/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API Endpoints
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { customerName, whatsapp, email, notes, items, totalPrice } = req.body;
    if (!customerName || !whatsapp || !items || !totalPrice) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }
    const order = db.saveOrder({ customerName, whatsapp, email, notes, items, totalPrice });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save order' });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Missing status field' });
    }
    const success = db.updateOrderStatus(id, status);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.get('/api/config', (req, res) => {
  try {
    const config = db.getConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve config' });
  }
});

app.post('/api/config', (req, res) => {
  try {
    const newConfig = req.body;
    const config = db.saveConfig(newConfig);
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save config' });
  }
});

// Serve static assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
