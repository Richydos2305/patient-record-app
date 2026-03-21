import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../User';
import { RefreshToken } from '../RefreshToken';
import { Patient } from '../Patient';
import { CustomField } from '../CustomField';
import { File } from '../File';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
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

describe('User model', () => {
  it('creates a valid user', async () => {
    const user = await User.create({ name: 'Alice', email: 'alice@test.com', password: 'hashed' });
    expect(user._id).toBeDefined();
    expect(user.email).toBe('alice@test.com');
  });

  it('requires name', async () => {
    await expect(User.create({ email: 'a@b.com', password: 'x' })).rejects.toThrow();
  });

  it('requires email', async () => {
    await expect(User.create({ name: 'Alice', password: 'x' })).rejects.toThrow();
  });

  it('requires password', async () => {
    await expect(User.create({ name: 'Alice', email: 'a@b.com' })).rejects.toThrow();
  });

  it('enforces unique email', async () => {
    await User.create({ name: 'Alice', email: 'dup@test.com', password: 'x' });
    await expect(User.create({ name: 'Bob', email: 'dup@test.com', password: 'y' })).rejects.toThrow();
  });
});

describe('RefreshToken model', () => {
  it('creates a valid refresh token', async () => {
    const token = await RefreshToken.create({
      userId: new mongoose.Types.ObjectId().toString(),
      token: 'abc123',
      expiresAt: new Date(Date.now() + 86400000),
      isRevoked: false
    });
    expect(token._id).toBeDefined();
    expect(token.isRevoked).toBe(false);
  });

  it('requires userId and token', async () => {
    await expect(RefreshToken.create({ expiresAt: new Date(), isRevoked: false })).rejects.toThrow();
  });
});

describe('Patient model', () => {
  it('creates a valid patient with required fields', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const patient = await Patient.create({ userId, name: 'John Doe' });
    expect(patient._id).toBeDefined();
    expect(patient.name).toBe('John Doe');
    expect(patient.prescriptions).toEqual([]);
    expect(patient.customValues).toEqual([]);
  });

  it('requires name', async () => {
    await expect(Patient.create({ userId: 'uid1' })).rejects.toThrow();
  });

  it('requires userId', async () => {
    await expect(Patient.create({ name: 'Jane' })).rejects.toThrow();
  });

  it('stores customValues', async () => {
    const patient = await Patient.create({
      userId: 'uid1',
      name: 'Bob',
      customValues: [{ fieldId: 'fid1', value: 'Penicillin' }]
    });
    expect(patient.customValues?.[0].value).toBe('Penicillin');
  });
});

describe('CustomField model', () => {
  it('creates a valid custom field', async () => {
    const field = await CustomField.create({
      userId: 'uid1',
      name: 'Allergies',
      type: 'text',
      required: false
    });
    expect(field._id).toBeDefined();
    expect(field.required).toBe(false);
  });

  it('requires name, type, userId', async () => {
    await expect(CustomField.create({ type: 'text' })).rejects.toThrow();
  });

  it('rejects invalid type', async () => {
    await expect(CustomField.create({ userId: 'u1', name: 'x', type: 'video' })).rejects.toThrow();
  });
});

describe('File model', () => {
  it('creates a valid file record', async () => {
    const file = await File.create({
      userId: 'uid1',
      filename: 'abc.jpg',
      originalName: 'photo.jpg',
      mimeType: 'image/jpeg',
      size: 1024,
      url: 'https://dummy.url/abc.jpg'
    });
    expect(file._id).toBeDefined();
    expect(file.url).toBe('https://dummy.url/abc.jpg');
  });

  it('requires filename, mimeType, size, url', async () => {
    await expect(File.create({ userId: 'u1', originalName: 'x' })).rejects.toThrow();
  });
});
