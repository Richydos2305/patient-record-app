import { FilterQuery } from 'mongoose';
import { BaseRepository } from './BaseRepository';
import { Patient, PatientDocument } from '../models/Patient';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PatientRepository extends BaseRepository<PatientDocument> {
  constructor() {
    super(Patient);
  }

  async findPaginated(
    userId: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedResult<PatientDocument>> {
    const query: FilterQuery<PatientDocument> = { userId };

    if (search) {
      query.$text = { $search: search };
    }

    const [data, total] = await Promise.all([
      Patient.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      Patient.countDocuments(query).exec()
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async search(userId: string, query: string): Promise<PatientDocument[]> {
    const regex = new RegExp(query, 'i');
    return await Patient.find({
      userId,
      $or: [
        { name: regex },
        { phone: regex },
        { notes: regex },
        { address: regex }
      ]
    })
      .limit(20)
      .exec();
  }
}
