// src/menu-item/menu-item.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { MenuItem } from './menu-item.entity';

@Controller('menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  // Create a new menu item
  @Post()
  create(@Body() data: Partial<MenuItem>): Promise<MenuItem> {
    return this.menuItemService.create(data);
  }

  // Get all menu items
  @Get()
  async findAll(): Promise<MenuItem[]> {
    console.log('Backend received GET /menu-items'); // debug log

    // Call findAll() with no arguments (service handles relations)
    const items = await this.menuItemService.findAll();
    console.log('Menu items returned:', items);

    return items;
  }

  // Get a single menu item by id
  @Get(':id')
  findOne(@Param('id') id: string): Promise<MenuItem> {
    return this.menuItemService.findOne(id);
  }

  // Update a menu item by id
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<MenuItem>): Promise<MenuItem> {
    return this.menuItemService.update(id, data);
  }

  // Delete a menu item by id
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.menuItemService.remove(id);
  }
}
