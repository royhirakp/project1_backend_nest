import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './schemas/item.schema';
import mongoose from 'mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name)
    private itemModel: mongoose.Model<Item>,
  ) {}

  async findAll(query: ExpressQuery): Promise<Item[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    const keyWord = query.keyWord
      ? {
          title: {
            $regex: query.keyWord,
            $options: 'i',
          },
        }
      : {};
    const item = await this.itemModel
      .find({ ...keyWord })
      .limit(resPerPage)
      .skip(skip);
    888;
    return item;
  }

  async create(item: Item, user: User): Promise<Item> {
    const data = Object.assign(item, { user: user._id });
    const res = await this.itemModel.create(data);
    return res;
  }

  async findByID(id: string): Promise<Item> {
    const validId = mongoose.isValidObjectId(id);

    if (!validId) throw new BadRequestException('book not found ');
    const item = await this.itemModel.findById(id);
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async updateVByID(id: string, item: Item): Promise<Item> {
    const updatedItem = await this.itemModel.findByIdAndUpdate(id, item, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) throw new NotFoundException('Item not found');
    return updatedItem;
  }

  async deleteById(id: string): Promise<{ status: number }> {
    const deletedItem = await this.itemModel.findByIdAndDelete(id);
    if (!deletedItem) throw new NotFoundException('Item not found');
    return { status: 1 };
  }
}
