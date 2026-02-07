import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';
import { Order } from '../order/order.entity';
import { MenuItem } from '../menu-item/menu-item.entity';
import { Payment } from '../payment/payment.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.orderItems)
  order: Order;

  @Column()
  orderId: string;

  @ManyToOne(() => MenuItem)
  menuItem: MenuItem;

  @Column()
  menuItemId: string;

  @OneToOne(() => Payment, payment => payment.order)
  payment: Payment;

  @Column('int')
  quantity: number;

  @Column('float')
  price: number;
}
