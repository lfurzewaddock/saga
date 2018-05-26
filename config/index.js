import moment from 'moment';

module.exports = {
  // Enable or disable server-side rendering
  enableSSR: true,

  // Enable or disable dynamic imports (code splitting)
  enableDynamicImports: false,

  // The env vars to expose on the client side. If you add them here, they will
  // be available on the client as process.env[VAR_NAME], same as they would be
  // in node.js.
  //
  // **WARNING**: Be careful not to expose any secrets here!
  clientEnv: [
    'NODE_ENV',
    'APPLICATION_BASE_URL',
    'ALGOLIA_APP_ID',
    'ALGOLIA_SEARCH_KEY'
  ],

  /* The identifier to use for css-modules.
   */
  cssModulesIdentifier: '[name]__[local]__[hash:base64:5]',

  cookieParams: {
    secure: ['development', 'test'].indexOf(process.env.NODE_ENV) === -1,
    maxAge: moment.duration(7, 'days').asMilliseconds()
  },

  // Isomorphic configuration
  isomorphicConfig: {
    assets: {
      images: {
        extensions: [
          'png',
          'jpg',
          'jpeg',
          'gif',
          'ico',
          'svg'
        ]
      }
    }
  }
};
