import { Schema, model, HydratedDocument } from 'mongoose';
import { ICustomField } from '../interfaces/models';

export type { ICustomField };

const customFieldSchema = new Schema<ICustomField>(
    {
        name:        { type: String, required: true, unique: true, trim: true },
        label:       { type: String, required: true, trim: true },
        type:        { type: String, required: true, enum: ['text', 'number', 'date', 'boolean', 'file'] },
        required:    { type: Boolean, default: false },
        description: { type: String, default: '' },
    },
    { timestamps: true },
);

export type ICustomFieldDocument = HydratedDocument<ICustomField>;
export const CustomFieldModel = model<ICustomField>('CustomField', customFieldSchema);
