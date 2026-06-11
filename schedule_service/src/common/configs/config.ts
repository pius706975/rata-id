import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3002,
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
};

export default (): Config => config;
