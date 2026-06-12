import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EMAIL_QUEUE } from '../utils/queue-contract';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: EMAIL_QUEUE,
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
      },
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
