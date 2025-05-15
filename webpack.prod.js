const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/BerbagiCeritaku/'
  },
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [{
        urlPattern: /\.(?:png|jpg|jpeg|svg|css|js|json|html)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'assets',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      }],
    }),
  ],
});
