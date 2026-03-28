import { FilterQuery, HydratedDocument, Model, QueryOptions, UpdateQuery } from 'mongoose';

export class BaseRepository<T> {
    constructor(protected readonly model: Model<T>) {}

    async findOne(filter: FilterQuery<T>): Promise<HydratedDocument<T> | null> {
        return this.model.findOne(filter).exec();
    }

    async find(filter: FilterQuery<T>): Promise<HydratedDocument<T>[]> {
        return this.model.find(filter).exec();
    }

    async create(data: Partial<T>): Promise<HydratedDocument<T>> {
        return this.model.create(data);
    }

    async updateOne(id: string, update: UpdateQuery<T>, options?: QueryOptions<T>): Promise<HydratedDocument<T> | null> {
        return this.model.findByIdAndUpdate(id, update, options).exec();
    }

    async deleteOne(filter: FilterQuery<T>): Promise<void> {
        await this.model.deleteOne(filter).exec();
    }
}
