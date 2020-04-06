const webpackConfig = require('./webpack.config.js');
webpackConfig.mode = 'production';

module.exports = function(config) {
  config.set({
    singleRun: true,
    browsers: [
      'PhantomJS'
    ],
    autoWatch: true,
    frameworks: [
      'es6-shim',
      'jasmine'
    ],

    files: [
      'spec.bundle.js'
    ],

    preprocessors: {
      'spec.bundle.js': ['webpack']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    plugins: [
      require('karma-jasmine'),
      require('karma-phantomjs-launcher'),
      require('karma-es6-shim'),
      require('karma-webpack')
    ]
  });
};