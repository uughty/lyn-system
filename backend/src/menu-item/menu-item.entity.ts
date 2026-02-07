import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from '../category/category.entity';

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column('float')
  price!: number;

  @Column({ nullable: true })
  imageUrl!: string;

  @Column()
  categoryId!: string;

  @ManyToOne(() => Category, category => category.menuItems)
  category!: Category;

  @Column({ default: true })
  isAvailable!: boolean;
}
