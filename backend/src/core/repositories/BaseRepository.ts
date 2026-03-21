import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async find(where: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(where).exec();
  }

  async findAll(where: FilterQuery<T> = {}): Promise<T[]> {
    return await this.model.find(where).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async update(where: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findOneAndUpdate(where, data, { new: true }).exec();
  }

  async delete(where: FilterQuery<T>): Promise<boolean> {
    const result = await this.model.deleteOne(where).exec();
    return result.deletedCount > 0;
  }

  async count(where: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(where).exec();
  }
}
