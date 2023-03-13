// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//     app.use(proxy('/fapi' , { target : 'http://http://localhost:3001/', changeOrigin: true}));
//     app.use(proxy('/friend' , { target : 'http://http://localhost:3001/', changeOrigin: true}));
// }


const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/fapi',
    createProxyMiddleware({
      target: 'https://fapi.binance.com',
      changeOrigin: true,
    })
  );
  app.use(
    '/sapi',
    createProxyMiddleware({
      target: 'https://api.binance.com',
      changeOrigin: true,
    })
  );
  app.use( //time
    '/api/v3',
    createProxyMiddleware({
      target: 'https://api.binance.com',
      changeOrigin: true,
    })
  );
  app.use(
    '/api/v2',
    createProxyMiddleware({
      target: 'https://www.bitcolabi.com',
      changeOrigin: true,
    })
  );
  app.use(
    '/event',
    createProxyMiddleware({
      target: 'https://www.bitcolabi.com',
      changeOrigin: true,
    })
  );
  app.use(
    '/public',
    createProxyMiddleware({
      target: 'https://www.bitcolabi.com/chart',
      changeOrigin: true,
    })
  );

  app.use(
    '/lol',
    createProxyMiddleware({
      target: 'https://kr.api.riotgames.com',
      changeOrigin: true,
    })
  );
};