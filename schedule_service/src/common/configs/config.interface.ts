export interface Config {
  nest: NestConfig;
  graphql: GraphQLConfig;
}

export interface NestConfig {
  port: number;
}

export interface GraphQLConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}
