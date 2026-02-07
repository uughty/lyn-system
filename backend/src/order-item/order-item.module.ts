import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderItem } from './order-item.entity';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';

import { MenuItem } from '../menu-item/menu-item.entity';

@Module({
  imports: [
    // 🔥 BOTH repositories used by the service must be here
    TypeOrmModule.forFeature([OrderItem, MenuItem]),
  ],
  providers: [OrderItemService],
  controllers: [OrderItemController],
  exports: [OrderItemService],
})
export class OrderItemModule {}
