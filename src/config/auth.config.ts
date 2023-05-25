import { cleanEnv, str, url } from 'envalid';

export default () => {
  const env = cleanEnv(process.env, {
    ST_CORE_URL: url({
      devDefault: 'http://127.0.0.1:3567/',
      desc: 'The API domain for the SuperTokens Core service',
    }),

    ST_API_KEY: str({
      devDefault: 'your-secret-key',
      desc: 'The API key for the SuperTokens Core service',
    }),

    APP_NAME: str({
      default: 'My App',
      desc: 'The name of your app or service',
    }),

    API_DOMAIN: url({ devDefault: `localhost:3000` }),
    WEB_DOMAIN: url({ example: 'localhost:8080' }),
  });

  return {
    supertokens: {
      connectionURI: env.ST_CORE_URL,
      apiKey: env.ST_API_KEY,

      appInfo: {
        appName: env.APP_NAME,
        apiDomain: env.API_DOMAIN,
        websiteDomain: env.WEB_DOMAIN,
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },
    },
  };
};
