import { Schema, model, Document } from 'mongoose';
import { IFile } from '../interfaces/models';

export interface FileDocument extends IFile, Document {}

const fileSchema = new Schema<FileDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    patientId: {
      type: String,
      ref: 'Patient'
    },
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

fileSchema.index({ userId: 1 });
fileSchema.index({ patientId: 1 });

export const File = model<FileDocument>('File', fileSchema);
