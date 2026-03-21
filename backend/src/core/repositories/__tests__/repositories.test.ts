import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserRepository } from '../UserRepository';
import { PatientRepository } from '../PatientRepository';

let mongoServer: MongoMemoryServer;
let userRepo: UserRepository;
let patientRepo: PatientRepository;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  userRepo = new UserRepository();
  patientRepo = new PatientRepository();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Promise.all(
    Object.values(mongoose.connection.collections).map(col => col.deleteMany({}))
  );
});

describe('BaseRepository (via UserRepository)', () => {
  it('create: inserts a document', async () => {
    const user = await userRepo.create({ name: 'Alice', email: 'alice@test.com', password: 'hash' });
    expect(user._id).toBeDefined();
    expect(user.name).toBe('Alice');
  });

  it('find: retrieves a document by filter', async () => {
    await userRepo.create({ name: 'Bob', email: 'bob@test.com', password: 'hash' });
    const found = await userRepo.find({ email: 'bob@test.com' });
    expect(found).not.toBeNull();
    expect(found?.name).toBe('Bob');
  });

  it('find: returns null when no match', async () => {
    const found = await userRepo.find({ email: 'none@test.com' });
    expect(found).toBeNull();
  });

  it('findAll: returns all matching documents', async () => {
    await userRepo.create({ name: 'A', email: 'a@test.com', password: 'h' });
    await userRepo.create({ name: 'B', email: 'b@test.com', password: 'h' });
    const all = await userRepo.findAll();
    expect(all.length).toBe(2);
  });

  it('update: updates and returns the updated document', async () => {
    const user = await userRepo.create({ name: 'Old', email: 'old@test.com', password: 'h' });
    const updated = await userRepo.update({ _id: user._id }, { name: 'New' });
    expect(updated?.name).toBe('New');
  });

  it('delete: removes a document', async () => {
    const user = await userRepo.create({ name: 'Del', email: 'del@test.com', password: 'h' });
    const deleted = await userRepo.delete({ _id: user._id });
    expect(deleted).toBe(true);
    const found = await userRepo.find({ _id: user._id });
    expect(found).toBeNull();
  });

  it('count: returns correct count', async () => {
    await userRepo.create({ name: 'X', email: 'x@test.com', password: 'h' });
    const count = await userRepo.count();
    expect(count).toBe(1);
  });
});

describe('PatientRepository', () => {
  const userId = new mongoose.Types.ObjectId().toString();

  it('findPaginated: returns first page', async () => {
    await Promise.all([
      patientRepo.create({ userId, name: 'Patient One' }),
      patientRepo.create({ userId, name: 'Patient Two' }),
      patientRepo.create({ userId, name: 'Patient Three' })
    ]);
    const result = await patientRepo.findPaginated(userId, 1, 2);
    expect(result.data.length).toBe(2);
    expect(result.total).toBe(3);
    expect(result.totalPages).toBe(2);
    expect(result.page).toBe(1);
  });

  it('findPaginated: second page returns remaining records', async () => {
    await Promise.all([
      patientRepo.create({ userId, name: 'A' }),
      patientRepo.create({ userId, name: 'B' }),
      patientRepo.create({ userId, name: 'C' })
    ]);
    const result = await patientRepo.findPaginated(userId, 2, 2);
    expect(result.data.length).toBe(1);
  });

  it('findPaginated: only returns patients owned by the requesting user', async () => {
    const otherUserId = new mongoose.Types.ObjectId().toString();
    await patientRepo.create({ userId, name: 'Mine' });
    await patientRepo.create({ userId: otherUserId, name: 'Theirs' });
    const result = await patientRepo.findPaginated(userId, 1, 10);
    expect(result.data.every(p => p.userId === userId)).toBe(true);
  });

  it('search: finds patients by name (case-insensitive)', async () => {
    await patientRepo.create({ userId, name: 'John Doe', phone: '1234' });
    await patientRepo.create({ userId, name: 'Jane Smith', phone: '5678' });
    const results = await patientRepo.search(userId, 'john');
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('John Doe');
  });

  it('search: finds patients by phone', async () => {
    await patientRepo.create({ userId, name: 'Mark', phone: '07700900000' });
    const results = await patientRepo.search(userId, '07700900000');
    expect(results.length).toBe(1);
  });
});
