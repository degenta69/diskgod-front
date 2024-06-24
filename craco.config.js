// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf);
      if (oneOfRule) {
        oneOfRule.oneOf.forEach(rule => {
          if (rule.use) {
            rule.use.forEach(use => {
              if (use.loader && use.loader.includes('postcss-loader')) {
                if (use.options) {
                  use.options.postcssOptions = {
                    plugins: [
                      require('tailwindcss'),
                      require('autoprefixer'),
                    ],
                  };
                }
              }
            });
          }
        });
      }
      return webpackConfig;
    },
  },
};
