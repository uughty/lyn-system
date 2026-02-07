// backend/src/category/category.controller.ts
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // GET /categories
  @Get()
  async findAll(): Promise<Category[]> {
    console.log('Backend received GET /categories'); // debug log
    const categories = await this.categoryService.findAll();
    console.log('Categories returned:', categories);
    return categories;
  }

  // GET /categories/:id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  // POST /categories
  @Post()
  async create(@Body() data: Partial<Category>): Promise<Category> {
    return this.categoryService.create(data);
  }
}
