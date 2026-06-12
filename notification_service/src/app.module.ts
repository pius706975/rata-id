import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import config from './common/configs/config';
import { GqlConfigService } from './gql-config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { BullModule } from '@nestjs/bull';
import { EMAIL_QUEUE } from './utils/queue-contract';
import { EmailProcessor } from './utils/email';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    BullModule.registerQueue({
      name: EMAIL_QUEUE,
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, EmailProcessor],
})
export class AppModule {}
