const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
    publicPath: '/BerbagiCeritaku/'
  },
  plugins: [
    new WorkboxPlugin.InjectManifest({
      swSrc: './src/sw-custom.js',
      swDest: 'service-worker.js',
    }),
  ],
});
