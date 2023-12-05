import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemSchema } from './schemas/item.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
  ],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
