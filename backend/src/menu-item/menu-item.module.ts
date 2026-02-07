import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './menu-item.entity';
import { MenuItemService } from './menu-item.service';
import { MenuItemController } from './menu-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem])],
  providers: [MenuItemService],
  controllers: [MenuItemController],
  exports: [MenuItemService],
})
export class MenuItemModule {}
