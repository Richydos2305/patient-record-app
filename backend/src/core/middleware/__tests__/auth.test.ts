import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express, { Request, Response } from 'express';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { auth } from '../auth';
import errorHandler from '../errorhandler';

const SECRET = 'test-secret';

// Override the settings module to use our test secret
process.env.ACCESSTOKENSECRET = SECRET;

const makeApp = () => {
  const app = express();
  app.use(express.json());
  app.get('/protected', auth, (_req: Request, res: Response) => {
    res.json({ userId: res.locals.userDetails.id });
  });
  app.use(errorHandler);
  return app;
};

const makeToken = (payload = { userDetails: { id: '123', name: 'Alice', email: 'a@b.com' } }) =>
  sign(payload, SECRET, { expiresIn: '15m' });

describe('auth middleware', () => {
  const app = makeApp();

  it('allows request with valid Bearer token', async () => {
    const token = makeToken();
    const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe('123');
  });

  it('rejects request with no Authorization header', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects request with malformed token', async () => {
    const res = await request(app).get('/protected').set('Authorization', 'Bearer bad.token.here');
    expect(res.status).toBe(401);
  });

  it('rejects request without Bearer prefix', async () => {
    const token = makeToken();
    const res = await request(app).get('/protected').set('Authorization', token);
    expect(res.status).toBe(401);
  });
});
