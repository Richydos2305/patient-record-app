import { Schema, model, Document } from 'mongoose';
import { ICustomField } from '../interfaces/models';

export interface CustomFieldDocument extends ICustomField, Document {}

const customFieldSchema = new Schema<CustomFieldDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['text', 'number', 'date', 'boolean', 'file'],
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

customFieldSchema.index({ userId: 1 });

export const CustomField = model<CustomFieldDocument>('CustomField', customFieldSchema);
