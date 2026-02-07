import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { MenuItem } from '../menu-item/menu-item.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(MenuItem)
    private readonly menuItemRepo: Repository<MenuItem>,
  ) {}

  async create(
    orderId: string,
    menuItemId: string,
    quantity: number,
  ): Promise<OrderItem> {
    const menuItem = await this.menuItemRepo.findOne({
      where: { id: menuItemId },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    const orderItem = this.orderItemRepo.create({
      orderId,
      menuItemId,
      quantity,
      price: menuItem.price * quantity,
    });

    return this.orderItemRepo.save(orderItem);
  }

  async findByOrder(orderId: string): Promise<OrderItem[]> {
    return this.orderItemRepo.find({
      where: { orderId },
      relations: ['menuItem'],
    });
  }
}
