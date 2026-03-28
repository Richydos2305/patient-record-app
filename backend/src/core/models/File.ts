import { Schema, model, HydratedDocument } from 'mongoose';
import { IFile } from '../interfaces/models';

export type { IFile };

const fileSchema = new Schema<IFile>(
    {
        originalName:  { type: String, required: true },
        cloudinaryId:  { type: String, required: true },
        url:           { type: String, required: true },
        mimetype:      { type: String, required: true },
        size:          { type: Number, required: true },
        patientId:     { type: Schema.Types.ObjectId, required: true, ref: 'Patient' },
    },
    { timestamps: true },
);

export type IFileDocument = HydratedDocument<IFile>;
export const FileModel = model<IFile>('File', fileSchema);
