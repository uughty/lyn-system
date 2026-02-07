// src/menu-item/menu-item.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
  ) {}

  // Get all menu items with category relation
  async findAll(): Promise<MenuItem[]> {
    return this.menuItemRepository.find({ 
      relations: ['category'] 
    });
  }

  // Get single menu item by ID with error handling
  async findOne(id: string): Promise<MenuItem> {
    const item = await this.menuItemRepository.findOne({ 
      where: { id }, 
      relations: ['category'] 
    });
    
    if (!item) {
      throw new NotFoundException(`MenuItem with id ${id} not found`);
    }
    
    return item;
  }

  // Create new menu item
  async create(data: Partial<MenuItem>): Promise<MenuItem> {
    const item = this.menuItemRepository.create(data);
    return this.menuItemRepository.save(item);
  }

  // Update existing menu item
  async update(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
    const item = await this.findOne(id); // Validates existence
    
    Object.assign(item, data);
    return this.menuItemRepository.save(item);
  }

  // Delete menu item
  async remove(id: string): Promise<void> {
    const result = await this.menuItemRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`MenuItem with id ${id} not found`);
    }
  }

  // Additional helpful methods
  async findByCategory(categoryId: string): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category']
    });
  }

  async findAvailable(): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      where: { isAvailable: true },
      relations: ['category']
    });
  }
}
