import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3003,
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
};

export default (): Config => config;
