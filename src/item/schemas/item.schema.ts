import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { User } from '../../auth/schemas/user.schema';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Item {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  author: string;

  @Prop()
  price: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
