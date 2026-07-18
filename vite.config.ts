import { defineConfig } from 'vite';
import { db } from './src/backend/db.js';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    {
      name: 'api-server-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/api')) {
            return next();
          }

          res.setHeader('Content-Type', 'application/json');

          // Helper to parse JSON body
          const parseJson = () => {
            return new Promise<any>((resolve) => {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', () => {
                try {
                  resolve(body ? JSON.parse(body) : {});
                } catch {
                  resolve({});
                }
              });
            });
          };

          const url = new URL(req.url, `http://${req.headers.host}`);
          const pathName = url.pathname;

          try {
            // GET /api/orders
            if (req.method === 'GET' && pathName === '/api/orders') {
              const orders = db.getOrders();
              res.statusCode = 200;
              res.end(JSON.stringify(orders));
              return;
            }

            // POST /api/orders
            if (req.method === 'POST' && pathName === '/api/orders') {
              const body = await parseJson();
              const { customerName, whatsapp, email, notes, items, totalPrice } = body;
              if (!customerName || !whatsapp || !items || !totalPrice) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing required fields' }));
                return;
              }
              const order = db.saveOrder({ customerName, whatsapp, email, notes, items, totalPrice });
              res.statusCode = 201;
              res.end(JSON.stringify(order));
              return;
            }

            // PUT /api/orders/:id/status
            if (req.method === 'PUT' && pathName.startsWith('/api/orders/')) {
              const parts = pathName.split('/');
              const id = parts[parts.length - 2] === 'orders' ? parts[parts.length - 1] : '';
              if (id) {
                const body = await parseJson();
                const { status } = body;
                const success = db.updateOrderStatus(id, status);
                if (success) {
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true }));
                } else {
                  res.statusCode = 404;
                  res.end(JSON.stringify({ error: 'Order not found' }));
                }
                return;
              }
            }

            // GET /api/config
            if (req.method === 'GET' && pathName === '/api/config') {
              const config = db.getConfig();
              res.statusCode = 200;
              res.end(JSON.stringify(config));
              return;
            }

            // POST /api/config
            if (req.method === 'POST' && pathName === '/api/config') {
              const body = await parseJson();
              const config = db.saveConfig(body);
              res.statusCode = 200;
              res.end(JSON.stringify(config));
              return;
            }

            // Default fallback
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
          } catch (e) {
            console.error('API Middleware error:', e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        });
      },
    },
  ],
});
