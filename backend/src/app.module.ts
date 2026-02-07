import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './auth/auth.module'; // ✅ ADD THIS
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgre123',
      database: 'swahili_coastal_crunch',

      autoLoadEntities: true,
      synchronize: true,   // OK for development only
      logging: true,
      
    }),
    ConfigModule.forRoot({
  isGlobal: true,
}),


    UserModule,
    CategoryModule,
    MenuItemModule,
    OrderModule,
    OrderItemModule,
    PaymentModule,
    AuthModule, // ✅ CRITICAL
  ],
})
export class AppModule {}
