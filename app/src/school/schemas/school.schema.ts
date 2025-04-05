import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SchoolDocument = HydratedDocument<School>;

@Schema()
export class School {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  place: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
