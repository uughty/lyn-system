import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Create a category
  create(data: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  // Get all categories
  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['menuItems'] });
  }

  // Get one category by ID
  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['menuItems'],
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  // Update a category by ID
  async update(id: string, data: Partial<Category>): Promise<Category> {
    const category = await this.findOne(id); // will throw if not found
    Object.assign(category, data);
    return this.categoryRepository.save(category);
  }

  // Remove a category by ID
  async remove(id: string): Promise<void> {
    const category = await this.findOne(id); // will throw if not found
    await this.categoryRepository.remove(category);
  }
}
