import { Types } from 'mongoose';
import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../../config/cloudinary';
import { FileRepository } from '../../repositories/FileRepository';
import { NotFoundError } from '../../errors/CustomErrors';
import { IFileDocument } from '../../models/File';

export class FileService {
    constructor(private readonly fileRepo: FileRepository) {}

    async upload(file: Express.Multer.File, patientId: string): Promise<IFileDocument> {
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto', folder: 'patient-records' },
                (error, result) => {
                    if (error || !result) return reject(error ?? new Error('Cloudinary upload failed'));
                    resolve(result);
                },
            );
            stream.end(file.buffer);
        });

        return this.fileRepo.create({
            originalName: file.originalname,
            cloudinaryId: result.public_id,
            url:          result.secure_url,
            mimetype:     file.mimetype,
            size:         file.size,
            patientId:    new Types.ObjectId(patientId),
        });
    }

    async listByPatient(patientId: string): Promise<IFileDocument[]> {
        return this.fileRepo.find({ patientId: new Types.ObjectId(patientId) });
    }

    async delete(filename: string): Promise<void> {
        const file = await this.fileRepo.findOne({ cloudinaryId: filename });
        if (!file) throw new NotFoundError('File not found');
        await cloudinary.uploader.destroy(file.cloudinaryId, { resource_type: 'auto' });
        await this.fileRepo.deleteOne({ cloudinaryId: filename });
    }
}
