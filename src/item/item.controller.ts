import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateBookDto } from './dto/create-item.dto';
import { Item } from './schemas/item.schema';
import { UpdateItemDto } from './dto/update-item.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}
  @Get()
  @UseGuards(AuthGuard())
  async getAllItmes(@Query() query: ExpressQuery): Promise<Item[]> {
    return this.itemService.findAll(query);
  }

  //post request
  @Post()
  @UseGuards(AuthGuard())
  async createBook(
    @Body()
    book: CreateBookDto,
    @Req() req,
  ): Promise<Item> {
    return this.itemService.create(book, req.user);
  }

  @Get(':id')
  async findById(
    @Param('id')
    id: string,
  ): Promise<Item> {
    return this.itemService.findByID(id);
  }

  //put request
  @Put(':id')
  async updateBook(
    @Param('id')
    id: string,
    @Body()
    item: UpdateItemDto,
  ): Promise<Item> {
    return this.itemService.updateVByID(id, item);
  }

  //delete request
  @Delete(':id')
  async deleteBook(
    @Param('id')
    id: string,
  ) {
    return this.itemService.deleteById(id);
  }
}
