import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as path from 'path';

const app = express();

app.use(
  '/api',
  createProxyMiddleware({
    target: process.env['TARGET'] || 'http://localhost:3000',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
  })
);

app.use(express.static('./dist/food-delivery-client'));

app.use('*', (req: any, res: any) => {
  res.sendFile(path.resolve('./dist/food-delivery-client/index.html'));
});

app.listen(process.env['PORT'] || 4000, () => {
  console.log('Application started');
});
